import React, { useState, useEffect } from "react";
import {
  Card,
  Image,
  Text,
  Badge,
  Button,
  Anchor,
  Group,
  Container,
} from "@mantine/core";
import { ethers } from "ethers";
import { config, isSupportedNetwork } from "../../lib/config";
import KaziKrypto from "../../../../contract/build/contracts/KaziKrypto.json"; // Replace with the actual path to your config file

interface GetPortfolioProps {
  freelancerAddress: string;
  index: number;
}

const GetPortfolioComponent: React.FC<GetPortfolioProps> = ({
  freelancerAddress,
  index,
}) => {
  const [portfolio, setPortfolio] = useState<any>(null); // Use the appropriate type

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
    async function fetchPortfolio() {
      try {
        const result = await contractInstance.getPortfolio(
          freelancerAddress,
          index
        );
        setPortfolio(result);
      } catch (error) {
        console.error("Error fetching portfolio:", error);
      }
    }

    fetchPortfolio();
  }, [freelancerAddress, index]);

  return (
    <div>
      {/* <h2>Get Portfolio Entry</h2>
      <p>Freelancer Address: {freelancerAddress}</p>
      <p>Portfolio Index: {index}</p> */}

      {portfolio && (
        <Container size="30rem">
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section>
              <Text weight={300} size="sm">
                {portfolio.images.join(", ")}
              </Text>
              <Text weight={300} size="sm">
                {portfolio.videos.join(", ")}
              </Text>
            </Card.Section>
            <h4>Portfolio {index}</h4>
            <Group position="apart" mt="md" mb="xs">
              <Text weight={300} size="sm">
                Task url
              </Text>
              <Anchor>{portfolio.taskUrl}</Anchor>
            </Group>
            <Text weight={600} size="md">
              Description
            </Text>
            <Text weight={300} size="sm">
              {portfolio.description}
            </Text>
          </Card>
        </Container>
      )}
    </div>
  );
};

export default GetPortfolioComponent;
