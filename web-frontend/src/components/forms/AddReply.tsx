import React, { useState, useEffect } from "react";
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

const PostReplyComponent: React.FC = () => {
  const [data, setData] = useState([
    { value: "react", label: "React" },
    { value: "ng", label: "Angular" },
  ]);
  const [receiver, setReceiver] = useState("");
  const [message, setMessage] = useState("");
  const [chatValue, setChatValue] = useState<File[]>([]);
  const [fileURLs, setFileURLs] = useState(null);
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

  const handlePostReply = async () => {
    if (!isMetaMaskInstalled) {
      // MetaMask not installed, show a message or prompt the user to install/connect
      console.error("Hitilafu kwenye kutuma meseji ya mteja");
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
      const tx = await contractInstance.chat(receiver, message, fileURLs);

      await tx.wait();
      console.log("Chat posted successfully!");
      notifications.show({
        title: "Successful",
        message: "chat posted successfully",
      });
    } catch (error) {
      console.error("Error posting client chat:", error);
    }
  };

  useEffect(() => {
    if (!isMetaMaskInstalled) {
      // MetaMask haiko imewekwa, unaweza kuonyesha ujumbe au kutekeleza hatua nyingine
      console.log("MetaMask haiko!");
    }
  }, [isMetaMaskInstalled]);

  return (
    <div>
      <Modal opened={opened} onClose={close} title="send message">
        {/* Modal content */}
        <TextInput
          label="to"
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
        />
        <Textarea
          label="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <FileInput
          label="files"
          withAsterisk
          multiple
          value={chatValue}
          onChange={(selectedFiles) => {
            setChatValue(selectedFiles); // Update the state with selected files
            OnChangeMFile(selectedFiles); // Call the OnChangeFile function
          }}
        />
        <br />
        {/* <Button onClick={handlePostReply} uppercase>
          Send
        </Button> */}
        {fileURLs !== null ? (
          <Button onClick={handlePostReply} uppercase>
            Send
          </Button>
        ) : (
          <Button disabled>upload chat file(s) to Enable Posting</Button>
        )}
      </Modal>
      <Group position="left">
        <Button onClick={open} variant="outline">
          Reply
        </Button>
      </Group>
    </div>
  );
};

export default PostReplyComponent;
