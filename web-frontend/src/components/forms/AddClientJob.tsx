import React, { useState ,useEffect} from "react";
import { ethers } from "ethers";
import {
  Input,
  TextInput,
  NumberInput,
  MultiSelect,
  Paper,
  Button,
  Modal,
  Group,
  Container,
  Checkbox,
  Textarea,
  FileInput,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useDisclosure } from "@mantine/hooks";
import { config, isSupportedNetwork } from "../../lib/config";
import KaziKrypto from "../../../../contract/build/contracts/KaziKrypto.json";
import { uploadToIPFS } from "~/Infura";

import { MetaMaskProvider, useMetaMask } from "~/hooks/useMetaMask";

const PostClientJobComponent: React.FC = () => {
  const [data, setData] = useState([
    { value: "react", label: "React" },
    { value: "ng", label: "Angular" },
  ]);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectDuration, setProjectDuration] = useState("");
  const [projectBudget, setProjectBudget] = useState(0);
  const [skillRequirements, setSkillRequirements] = useState<string[]>([]);
  const [fileURL, setFileURL] = useState(null);
  const [fileURLs, setFileURLs] = useState(null);
  const [images, setImages] = useState("");
  const [imagesValue, setImagesValue] = useState<File[]>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const contractAddress = config["0xe704"].contractAddress;
  const contractABI = KaziKrypto.abi;
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

  const networkId = import.meta.env.VITE_PUBLIC_NETWORK_ID;

  if (!isSupportedNetwork(networkId)) {
    throw new Error("unsurported network , tafadhali nani fuata maelekezo");
  }



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

  const handlePostClientJob = async () => {
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
      const skillRequirementsArray = skillRequirements.map((skill) =>
        skill.trim()
      );
      const imagesArray = images.split(",").map((image) => image.trim());

      const tx = await contractInstance.postAClientJob(
        projectTitle,
        projectDescription,
        projectDuration,
        projectBudget,
        skillRequirementsArray,
        fileURLs,
        {
          value: ethers.utils.parseEther(projectBudget.toString()), // Convert projectBudget to wei
        }
      );

      await tx.wait();
      console.log("Client job posted successfully!");
      notifications.show({
        title: "Successful",
        message: "Job posted successfully",
      });
    } catch (error) {
      console.error("Error posting client job:", error);
    }
  };

    useEffect(() => {
      if (!isMetaMaskInstalled) {
        // MetaMask haiko imewekwa, unaweza kuonyesha ujumbe au kutekeleza hatua nyingine
        console.log("MetaMask haiko imewekwa");
      }
    }, [isMetaMaskInstalled]);

  return (
    <div>
      <Modal opened={opened} onClose={close} title="Post A task">
        {/* Modal content */}
        <TextInput
          label="Project title"
          value={projectTitle}
          onChange={(e) => setProjectTitle(e.target.value)}
        />
        <Textarea
          label="Project Description"
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
        />
        <TextInput
          label="Project Duration"
          value={projectDuration}
          onChange={(e) => setProjectDuration(e.target.value)}
        />
        <NumberInput
          label="Hourly Rate"
          precision={6}
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          formatter={(value) =>
            !Number.isNaN(parseFloat(value))
              ? `ETH ${value}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
              : "ETH "
          }
          onChange={(value: number) => setProjectBudget(value)}
        />
        <MultiSelect
          label="Skills"
          data={data}
          placeholder="Select items"
          searchable
          creatable
          getCreateLabel={(query) => `+ Create ${query}`}
          onCreate={(query) => {
            const item = { value: query, label: query };
            setData((current) => [...current, item]);
            return item;
          }}
          onChange={(value: string[]) => {
            setSkillRequirements(value);
            console.log(skillRequirements);
          }}
        />
        <FileInput
          label="project file"
          withAsterisk
          multiple
          value={imagesValue}
          onChange={(selectedFiles) => {
            setImagesValue(selectedFiles); // Update the state with selected files
            OnChangeMFile(selectedFiles); // Call the OnChangeFile function
          }}
        />
        <br />
        {/* <Button onClick={handlePostClientJob} uppercase>
          Post Client Job
        </Button> */}
        {fileURLs !== null ? (
          <Button onClick={handlePostClientJob} uppercase>
            Post Client Job
          </Button>
        ) : (
          <Button disabled>upload project file(s) to Enable Posting</Button>
        )}
      </Modal>
      <Group position="center">
        <Button onClick={open}>Post a Job</Button>
      </Group>
    </div>
  );
};

export default PostClientJobComponent;
