import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import {
  Card,
  Image,
  Text,
  Badge,
  Button,
  Group,
  Container,
  FileInput,
  Rating,
  Box,
  Table,
  TextInput,
  NumberInput,
  Textarea,
} from "@mantine/core";
import { IconFile, IconDownload } from "@tabler/icons-react";
import { formatAddress, formatChainAsNum } from "~/utils";
import { notifications } from "@mantine/notifications";
import { useNavigate, useParams } from "react-router-dom";
import { config, isSupportedNetwork } from "../../lib/config";
import { useMetaMask } from "~/hooks/useMetaMask";
import KaziKrypto from "../../../../contract/build/contracts/KaziKrypto.json";
import { type MetaMaskInpageProvider } from "@metamask/providers"; // Replace with the actual path to your config file
import { uploadToIPFS } from "~/Infura";
import { useAccountId } from "~/hooks/UseAccount";
import { formatBalance } from "~/utils";
import Milestones from "../milestones/Milestones";

export const ViewClientJobsMilestonesComponent: React.FC = () => {
  const params = useParams();
  console.log(params);
  const [clientJobs, setClientJobs] = useState<any[]>([]); // Use the appropriate type
  const [singleJob, setSingleJob] = useState<any>();
  const contractAddress = config["0xe704"].contractAddress;
  const contractABI = KaziKrypto.abi;
  const [fileURLs, setFileURLs] = useState(null);
  const [budget, setBudget] = useState<number>();
  const [imagesValue, setImagesValue] = useState<File[]>([]);
  const [description, setDescription] = useState("");
  const [milestoneDuration, setMilestoneDuration] = useState("");
  const [bids, setBids] = useState<any[]>([]);
  const { accountId } = useAccountId();
  const [milestoneName, setMilestoneName] = useState("");
  const [userAdress, setUserAdress] = useState<any>(null);

  const {
    dispatch,
    state: {
      status,
      isMetaMaskInstalled,
      wallet,
      balance,
      chainId,
      walletContainer,
    },
  } = useMetaMask();

  const OnChangeMFile = async (selectedFiles: File[]) => {
    // Placeholder logic: Upload files to IPFS
    const uploadedUrls: string[] = [];

    for (const file of selectedFiles) {
      const response = await uploadToIPFS(file); // Your actual IPFS upload function
      uploadedUrls.push(response);
    }

    // Placeholder logic: Handle changes, such as updating URLs
    console.log("Uploaded URLs:", uploadedUrls);
    setFileURLs(uploadedUrls); // Assuming you have a state to store the URLs
  };

  const handleMakeBidding = async () => {
    if (!isMetaMaskInstalled) {
      // MetaMask not installed, show a message or prompt the user to install/connect
      console.error("Hitilafu kwenye kutuma kazi ya mteja");
      return;
    }
    const provider = new ethers.providers.Web3Provider(
      window.ethereum as unknown as ethers.providers.ExternalProvider
    );
    const signer = provider.getSigner();

    const contractInstance = new ethers.Contract(
      contractAddress,
      contractABI,
      signer
    );

    try {
      // console.log(params.jobId);
      const tx = await contractInstance.makeABidding(
        ethers.BigNumber.from(params.jobId),
        description,
        ethers.BigNumber.from(budget),
        fileURLs
      );
      await tx.wait();
      console.log("client bid successful");
      notifications.show({
        title: "Successful",
        message: "bid done successful",
      });
    } catch (e) {
      console.error("Error posting client job:", e);
    }
  };

  useEffect(() => {
    const ethereumProviderInjected = typeof window.ethereum !== "undefined";
    const isMetaMaskInstalled =
      ethereumProviderInjected && Boolean(window.ethereum.isMetaMask);

    if (isMetaMaskInstalled) {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum as unknown as ethers.providers.ExternalProvider
      );
      const contractInstance = new ethers.Contract(
        contractAddress,
        contractABI,
        provider
      );

      async function connectToUserWallet() {
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setUserAdress(address);
      }

      connectToUserWallet();

      async function callViewFunction() {
        try {
          const result = await contractInstance.getBids(params.jobId);
          // console.log(result);
          // console.log("holla");
          setBids(result);
        } catch (error) {
          console.error("Error calling view function:", error);
        }
      }
      callViewFunction();
    }
  }, [contractAddress, contractABI]);

  console.log("am here", bids);
  //  console.log("haloooooooooooooooo")

  const handleAddMilestone = async () => {
    if (!isMetaMaskInstalled) {
      // MetaMask not installed, show a message or prompt the user to install/connect
      console.error("Hitilafu kwenye kutuma kazi ya mteja");
      return;
    }
    const provider = new ethers.providers.Web3Provider(
      window.ethereum as unknown as ethers.providers.ExternalProvider
    );
    const signer = provider.getSigner();

    const contractInstance = new ethers.Contract(
      contractAddress,
      contractABI,
      signer
    );

    try {
      const new_jobId = parseInt(params.jobId);
      const new_bidId = parseInt(params.bidId);

      console.log(new_jobId, new_bidId, budget, milestoneDuration);

      const tx = await contractInstance.addProjectMileStone(
        ethers.BigNumber.from(new_jobId),
        ethers.BigNumber.from(new_bidId),
        milestoneName,
        description,
        ethers.BigNumber.from(budget),
        ethers.BigNumber.from(milestoneDuration)
      );
      await tx.wait();
      console.log("milestone addition successful");
      notifications.show({
        title: "Successful",
        message: "milestone addition done successful",
      });
    } catch (e) {
      console.error("Error posting milestone :", e);
    }
  };

  useEffect(() => {
    const ethereumProviderInjected = typeof window.ethereum !== "undefined";
    const isMetaMaskInstalled =
      ethereumProviderInjected && Boolean(window.ethereum.isMetaMask);

    if (isMetaMaskInstalled) {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum as unknown as ethers.providers.ExternalProvider
      );
      const contractInstance = new ethers.Contract(
        contractAddress,
        contractABI,
        provider
      );

      async function callViewFunction() {
        try {
          const result = await contractInstance.getClientJob();
          for (let i = 0; i < result.length; i++) {
            if (result[i].jobId.toString() == params.jobId) {
              console.log(result[i]);
              setSingleJob(result[i]);
            }
          }
        } catch (error) {
          console.error("Error calling view function:", error);
        }
      }
      callViewFunction();
    }
  }, [contractAddress, contractABI]);

  // const rows = bids ? bids.map((bid, index) => (
  //   <tr key={index}>
  //     bid
  //   </tr>
  // )): "no bids yet";

  return (
    <>
      {singleJob ? (
        <Container>
          <Card
            shadow="sm"
            sx={{ marginBottom: 20, backgroundColor: "#feffff" }}
            padding="lg"
            radius="md"
            withBorder
          >
            <Group position="apart" mt="md" mb="xs">
              <Text weight={300} size="sm">
                #{singleJob.jobId.toString()}
              </Text>
            </Group>
            <Text size="lg" weight={600}>
              {singleJob.projectTitle}
            </Text>
            <br />
            <Group
              position="center"
              style={{ backgroundColor: "#fbfefb", borderRadius: 10 }}
            >
              {singleJob.images.map((imageURL, index) => (
                <div key={index} className="image-card">
                  <p className="file-filename">file {index + 1}</p>
                  <IconFile color="blue" name="image" size={48} />{" "}
                  {/* Replace "image" with the name of your image icon */}
                  <a
                    href={imageURL}
                    download={`image-${index + 1}.jpg`} // Provide a unique download filename with extension
                    className="download-icon"
                    target="_blank"
                  >
                    <IconDownload color="black" name="download" size={24} />{" "}
                    {/* Replace "download" with the name of your download icon */}
                  </a>
                </div>
              ))}
            </Group>
            <br />
            <Text weight={400} size="md">
              Budget:{" "}
              <span style={{ fontSize: 14, color: "blue" }}>
                {singleJob.projectBudget.toString()} ETH
              </span>
            </Text>
            <Text weight={400} size="md" style={{ fontSize: 14 }}>
              Duration: <span color="grey">{singleJob.projectDuration}</span>
            </Text>
            <Text weight={300} size="md">
              {singleJob.projectDescription}
            </Text>
            <br />
            <Text weight={300} size="md">
              {singleJob.skillRequirements.map((skill, index) => (
                <Badge key={index}>{skill}</Badge>
              ))}
            </Text>
            <br />
            Account ID:{" "}
            <span style={{ color: "blue" }}>
              {formatAddress(singleJob.accountId)}
            </span>
            <br />
            <br />
            {/* await instance.addProjectMileStone(
      jobId,
      bidId,
      milestoneName1,
      milestoneDescription1,
      milestoneBudget1,
      milestoneDuration1,
      { from: freelancer }
    );
          */}
            {singleJob ? (
              userAdress === singleJob.accountId ? (
                " "
              ) : (
                <>
                  <Text size="lg" weight={600}>
                    New Milestone
                  </Text>
                  <Container size="30rem" sx={{ backgroundColor: "#ffffff" }}>
                    <TextInput
                      label="Name"
                      value={milestoneName}
                      onChange={(e) => setMilestoneName(e.target.value)}
                    />
                    <NumberInput
                      label="Milestone Budget"
                      precision={6}
                      parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                      formatter={(value) =>
                        !Number.isNaN(parseFloat(value))
                          ? `ETH ${value}`.replace(
                              /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                              ","
                            )
                          : "ETH "
                      }
                      onChange={(value: number) => setBudget(value)}
                    />
                    <TextInput
                      label="Duration"
                      value={milestoneDuration}
                      onChange={(e) => setMilestoneDuration(e.target.value)}
                    />
                    <Textarea
                      label="Description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                    <br />
                    <Button onClick={handleAddMilestone} uppercase>
                      Add
                    </Button>
                    ;
                  </Container>
                </>
              )
            ) : (
              <Text>No Single Job</Text>
            )}
          </Card>
        </Container>
      ) : (
        "no Data"
      )}
      <br />
      {bids.length > 0 ? (
        <Milestones
          jobId={params.jobId}
          singleJob={singleJob}
          bidId={params.bidId}
        />
      ) : (
        "No bids"
      )}
    </>
  );
};

export default ViewClientJobsMilestonesComponent;
