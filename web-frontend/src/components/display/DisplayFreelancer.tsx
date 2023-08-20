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

interface GetFreelancerProps {
  freelancerAddress: string;
}

const GetFreelancerComponent: React.FC<GetFreelancerProps> = ({
  freelancerAddress,
}) => {
  const [freelancer, setFreelancer] = useState<any>(null); // Use the appropriate type

  const contractAddress = config["0xe704"].contractAddress;
  const contractABI = KaziKrypto.abi;
  const provider = new ethers.providers.Web3Provider(
    window.ethereum as unknown as ethers.providers.ExternalProvider
  );
  const contractInstance = new ethers.Contract(
    contractAddress,
    contractABI,
    provider
  );

  useEffect(() => {
    async function fetchFreelancer() {
      try {
        const result = await contractInstance.getFreelancer(freelancerAddress);
        setFreelancer(result);
      } catch (error) {
        console.error("Error fetching freelancer:", error);
      }
    }

    fetchFreelancer();
  }, [freelancerAddress]);

  return (
    <div>
      <Container size="30rem">
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section>
            <Text weight={300} size="sm">
              {freelancer && freelancer.profileImage}
            </Text>
          </Card.Section>
          <Text size="md">{freelancer && freelancer.fullName}</Text>
          {freelancer && (
            <Group position="apart" mt="md" mb="xs">
              <Text weight={300} size="sm">
                {`${freelancerAddress.substr(
                  0,
                  9
                )}......${freelancerAddress.slice(-6)}`}
              </Text>
              <Badge color="black" variant="light">
                {freelancer && freelancer.isProfilePublic
                  ? "Public"
                  : "Private"}
              </Badge>
            </Group>
          )}

          {freelancer && (
            <>
              <Group>
                <Text weight={300} size="sm">
                  Hourly Rate
                </Text>
                <Text>{freelancer.hourlyRate.toNumber()}</Text>
              </Group>
              <Group>
                <Text weight={300} size="sm">
                  Profession
                </Text>
                <Text>{freelancer.profession}</Text>
              </Group>
              <Group>
                <Text weight={300} size="sm">
                  Payment Preference:
                </Text>
                <Text>{freelancer.paymentPreference}</Text>
              </Group>
              <Group>
                <Rating readOnly value={freelancer.profileRating.toNumber()} />
              </Group>
              <br />
              {freelancer.skills.map((skill) => (
                <Badge color="blue">{skill}</Badge>
              ))}
            </>

            // <div>
            //   <h3>Freelancer Details</h3>
            //   <p>Full Name: </p>
            //   <p>Profile Image: {}</p>
            //   <p>Hourly Rate: {}</p>
            //   <p>Profession: {}</p>
            //   <p>Payment Preference: {}</p>
            //   <p>Skills: {}</p>
            //   <p>Profile Rating: {}</p>
            //   <p>Is Profile Public: {freelancer.isProfilePublic ? "Yes" : "No"}</p>
            // </div>
          )}
        </Card>
      </Container>
    </div>
  );
};

export default GetFreelancerComponent;
