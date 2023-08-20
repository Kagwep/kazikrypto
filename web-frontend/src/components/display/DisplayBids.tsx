import React, { useState, useEffect } from "react";
import {
  Card,
  Image,
  Text,
  Badge,
  Button,
  Group,
  Container,
  Rating,
} from "@mantine/core";
import { ethers } from "ethers";
import { config, isSupportedNetwork } from "../../lib/config";
import KaziKrypto from "../../../../contract/build/contracts/KaziKrypto.json"; // Replace with the actual path to your config file
import { formatAddress } from "~/utils";
import { useNavigate, useParams } from "react-router-dom";

interface GetBidsComponent {
  freelancerAddress: string;
  jobId: string;
  singleJob: any;
}

const GetBidsComponent: React.FC<GetBidsComponent> = ({
  freelancerAddress,
  jobId,
  singleJob,
}) => {
  const [bids, setBids] = useState<any[]>([]); // Use the appropriate type

  const contractAddress = config["0xe704"].contractAddress;
  const contractABI = KaziKrypto.abi;
  const navigate = useNavigate();
  

  async function approveBid(bidId) {
    try {
      const ethereumProviderInjected = typeof window.ethereum !== "undefined";
      const isMetaMaskInstalled =
        ethereumProviderInjected && Boolean(window.ethereum.isMetaMask);

      if (isMetaMaskInstalled) {
        const provider = new ethers.providers.Web3Provider(
          window.ethereum as unknown as ethers.providers.ExternalProvider
        );

        const signer = provider.getSigner(); // Get the connected signer
        const contract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

         // Make sure jobId is in the right format
        const new_jobId = parseInt(jobId);
        const transaction = await contract.acceptBid(new_jobId, bidId);

        await transaction.wait(); // Wait for the transaction to be mined
        console.log("Bid accepted successfully!");
      }
    } catch (error) {
      console.error("Error approving bid:", error);
    }
  }

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
          const result = await contractInstance.getBids(jobId);
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

function goToMilestonesPage(x,y) {
      navigate(`/job/${x}/milestones/${y}`);
    }

  return (
    <div>
      {bids.length > 0 ? (
        <Container>
          {bids.map((bid, index) => (
            <Card
              key={index}
              shadow="sm"
              sx={{ marginBottom: 20 }}
              padding="lg"
              radius="md"
              withBorder
            >
              <Text weight={400} size="md" style={{ fontSize: 14 }}>
                Bid from:
                <span style={{ color: "blue" }}>
                  {""} {formatAddress(bid.accountId)}
                </span>
              </Text>
              <br />
              <Text weight={400} size="md" style={{ fontSize: 14 }}>
                Amount:{" "}
                <span style={{ color: "green" }}>
                  {bid.budget.toString()} ETH
                </span>
              </Text>
              <br />
              <Text weight={300} size="md">
                {bid.bidDescription}
              </Text>
              <br />

              <Text weight={300} size="md">
                {bid.bidApproved ? (
                  <>
                    <Text weight={300} size="md" color="green">
                      Approved
                    </Text>
                    {singleJob ? (
                      bid.accountId === freelancerAddress ||
                      freelancerAddress == singleJob.accountId ? (
                        <Button
                          onClick={() => {
                            goToMilestonesPage(
                              singleJob.jobId.toString(),
                              bid.bidId.toString()
                            );
                          }}
                        >
                          Milestones
                        </Button>
                      ) : (
                        " "
                      )
                    ) : (
                      <Text>No Single Job</Text>
                    )}
                  </>
                ) : (
                  <>
                    <Text
                      weight={300}
                      size="md"
                      color="red"
                      style={{ fontSize: 14, fontWeight: 600 }}
                    >
                      Not Approved
                    </Text>
                    {singleJob ? (
                      freelancerAddress === singleJob.accountId ? (
                        <Button onClick={() => approveBid(bid.bidId)}>
                          Approve Bid
                        </Button>
                      ) : (
                        " "
                      )
                    ) : (
                      <Text>No Single Job</Text>
                    )}
                  </>
                )}
              </Text>
            </Card>
          ))}
        </Container>
      ) : (
        "No bids"
      )}
    </div>
  );
};

export default GetBidsComponent;
