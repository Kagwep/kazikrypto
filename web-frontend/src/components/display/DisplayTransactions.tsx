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
  Paper,
} from "@mantine/core";
import { ethers } from "ethers";
import { config, isSupportedNetwork } from "../../lib/config";
import KaziKrypto from "../../../../contract/build/contracts/KaziKrypto.json"; // Replace with the actual path to your config file
import { formatAddress, formatChainAsNum } from "~/utils";
import { formatBalance } from "~/utils";


interface GetTransactionsComponent {
  freelancerAddress: string;
}

const GetTransactionsComponent: React.FC<GetTransactionsComponent> = ({
  freelancerAddress,
}) => {
  const [transactions, setTransactions] = useState<any[]>([]); // Use the appropriate type

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
    async function fetchTransactions() {
      try {
        const result = await contractInstance.getFreelancerTransactions(
          freelancerAddress
        );
        setTransactions(result);
        console.log("haha",result)
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    }

    fetchTransactions();
  }, [freelancerAddress]);

  return (
    <div>
      {transactions.length > 0 ? (
        <Container size="30rem">
          {transactions.map((transaction, index) => (
            <Paper key={index} shadow="xs" p="md">
              <Text weight={300} style={{ fontSize: 14 }} color="grey">
                from:{" "}
                <span style={{ color: "blue" }}>
                  {" "}
                  {formatAddress(transaction.from)}
                </span>
              </Text>
              <Text weight={300} style={{ fontSize: 14 }} color="grey">
                to:{" "}
                <span style={{ color: "blue" }}>
                  {" "}
                  {formatAddress(transaction.to)}
                </span>
              </Text>
              <Text weight={300} style={{ fontSize: 12 }} color="grey">
                {new Date(
                  parseInt(transaction.timestamp._hex, 16) * 1000
                ).toLocaleString()}
              </Text>
              <Text weight={300} style={{ fontSize: 12 }} color="blue">
                {formatBalance(transaction.transactionAmount)}
              </Text>

              <Text>{transaction.transactionPurpose}</Text>
              <Text weight={300} size="md">
                {transaction.transactionStatus}
              </Text>
            </Paper>
          ))}
        </Container>
      ) : (
        <Container>
          <Text align="center"> No transactions yet </Text>
        </Container>
      )}
    </div>
  );
};

export default GetTransactionsComponent;
