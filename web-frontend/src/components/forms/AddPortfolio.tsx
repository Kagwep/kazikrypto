import React, { useState } from "react";
import { ethers } from "ethers";
import {
  Input,
  TextInput,
  NumberInput,
  MultiSelect,
  Paper,
  Button,
  Container,
  Textarea,
  Checkbox,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { config, isSupportedNetwork } from "../../lib/config";
import KaziKrypto from "../../../../contract/build/contracts/KaziKrypto.json"; // Replace with the actual path to your config file

const AddPortfolioComponent: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [taskUrl, setTaskUrl] = useState("");
  const [description, setDescription] = useState("");

  const contractAddress = config["0xe704"].contractAddress;
  const contractABI = KaziKrypto.abi;
  const provider = new ethers.providers.Web3Provider(
    window.ethereum as unknown as ethers.providers.ExternalProvider
  );
  const signer = provider.getSigner();

  const networkId = import.meta.env.VITE_PUBLIC_NETWORK_ID;

  if (!isSupportedNetwork(networkId)) {
    throw new Error("unsurported network , tafadhali nani fuata maelekezo");
  }

  const contractInstance = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );

  const handleAddPortfolio = async () => {
    try {
      const tx = await contractInstance.addPortfolio(
        images,
        videos,
        taskUrl,
        description
      );

      await tx.wait();
      console.log("Portfolio added successfully!");
      // Reset form fields
      setImages([]);
      setVideos([]);
      setTaskUrl("");
      setDescription("");
    } catch (error) {
      console.error("Error adding portfolio:", error);
    }
  };

  return (
    <Container size="30rem">
      <h4>Add Portfolio</h4>
      <Paper sx={{ padding: 10 }}>
        <TextInput
          label="Images"
          value={images.join(",")}
          onChange={(e) => setImages(e.target.value.split(","))}
        />

        <TextInput
          label="Videos"
          value={videos.join(",")}
          onChange={(e) => setVideos(e.target.value.split(","))}
        />

        <TextInput
          label="Task Url"
          value={taskUrl}
          onChange={(e) => setTaskUrl(e.target.value)}
        />

        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="your work description here..."
          label="description"
        />

        <br />

        <Button onClick={handleAddPortfolio}>Add Portfolio</Button>
      </Paper>
    </Container>
  );
};

export default AddPortfolioComponent;
