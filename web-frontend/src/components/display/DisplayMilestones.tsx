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
import { ethers,utils } from "ethers";
import { config, isSupportedNetwork } from "../../lib/config";
import KaziKrypto from "../../../../contract/build/contracts/KaziKrypto.json"; // Replace with the actual path to your config file
import { formatAddress } from "~/utils";


interface GetMilestonesComponent {
  freelancerAddress: string;
  jobId: string;
  singleJob: any;
  bidId:string;
}

const GetMilestonesComponent: React.FC<GetMilestonesComponent> = ({
  freelancerAddress,
  jobId,
  singleJob,
  bidId,

}) => {
  const [milestones, setMilestones] = useState<any[]>([]); // Use the appropriate type
  console.log("bidid", bidId);
  const contractAddress = config["0xe704"].contractAddress;
  const contractABI = KaziKrypto.abi;
  const [bid, setBid] = useState<any>();
  

  async function handleApproveProjectMilestone(mileStoneId) {
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
        const new_mileStoneId = parseInt(mileStoneId);
        const payableAddress = utils.getAddress(bid.accountId);
        console.log("ciiiiiisaas",payableAddress);
        const transaction = await contract.approveProjectMilestone(
          payableAddress,
          new_mileStoneId
        );

        await transaction.wait(); // Wait for the transaction to be mined
        console.log("milestone accepted successfully!");
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

      async function callBidFunction() {
        try {
          const result = await contractInstance.getBid(jobId, bidId);
          console.log(result);
          console.log("holla");
          setBid(result);
        } catch (error) {
          console.error("Error calling view function:", error);
        }
      }
      callBidFunction();

      async function callViewFunction() {
        try {
          const new_bidId = parseInt(bidId);
          const result = await contractInstance.getProjectMileStones(new_bidId);
          // console.log(result);
          // console.log("holla");
          setMilestones(result);
        } catch (error) {
          console.error("Error calling view function:", error);
        }
      }
      callViewFunction();
    }
  }, [contractAddress, contractABI]);

  console.log("am here", milestones);

  return (
    <div>
      {milestones.length > 0 ? (
        <Container>
          {milestones.map((milestone, index) => (
            <Card
              key={index}
              shadow="sm"
              sx={{ marginBottom: 20 }}
              padding="lg"
              radius="md"
              withBorder
            >
              <Text weight={400} size="md" style={{ fontSize: 14 }}>
                Duration:
                <span style={{ color: "blue" }}>
                  {""} {milestone.milestoneDuration.toString()}
                </span>
              </Text>
              <br />
              <Text weight={400} size="md" style={{ fontSize: 14 }}>
                Amount:{" "}
                <span style={{ color: "green" }}>
                  {milestone.milestoneBudget.toString()} ETH
                </span>
              </Text>
              <br />
              <Text weight={300} size="md">
                {milestone.milestoneDescription}
              </Text>
              <br />

              <Text weight={300} size="md">
                {milestone.milestoneWorkApproved ? (
                  <Text weight={300} size="md" color="green">
                    Approved
                  </Text>
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
                        <Button
                          onClick={() =>
                            handleApproveProjectMilestone(milestone.mileStoneId)
                          }
                        >
                          Approve Milestone
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
        "No milestones"
      )}
    </div>
  );
};

export default GetMilestonesComponent;
