import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { formatAddress, formatChainAsNum } from "~/utils";
import {
  Card,
  Anchor,
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
  Notification,
  Paper,
} from "@mantine/core";
import {
  IconTrash,
  IconBookmark,
  IconCalendar,
  IconChevronDown,
  IconWallet,
  IconCurrencyEthereum,
  IconInfoCircle,
  IconAddressBook,
  IconMessage2,
  IconCheck,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { useNavigate, useParams } from "react-router-dom";
import { config, isSupportedNetwork } from "../../lib/config";
import { useMetaMask } from "~/hooks/useMetaMask";
import KaziKrypto from "../../../../contract/build/contracts/KaziKrypto.json";
import { type MetaMaskInpageProvider } from "@metamask/providers"; // Replace with the actual path to your config file
import { uploadToIPFS } from "~/Infura";
import { useAccountId } from "~/hooks/UseAccount";
import PostChatComponent from "../forms/AddChat";
import PostReplyComponent from "../forms/AddReply";


const ViewChatsComponent: React.FC = () => {
  const navigate = useNavigate();
  const [chats, setChats] = useState<any[]>([]); // Use the appropriate type
  const contractAddress = config["0xe704"].contractAddress;
  const contractABI = KaziKrypto.abi;
    const {
      dispatch,
      state: {
        wallet,
      },
    } = useMetaMask();


  function goToDetailsPage(x) {
    navigate(`/jobs/${x}`);
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

      

      async function fetchChats() {
        try {
          const result = await contractInstance.getChats(wallet);
          setChats(result);
          console.log(result)
        } catch (error) {
          console.error("Error fetching portfolio:", error);
        }
      }

      fetchChats();
    }
  }, [contractAddress, contractABI,wallet]);

  return (
    <div className="chat">
      <Container>
        <Text>
          <Anchor component="button" align="center" sx={{ padding: 10 }}>
            <PostChatComponent />
          </Anchor>
        </Text>
      </Container>
      {chats.length > 0 ? (
        <Container>
          {chats.map((chat, index) => (
            <Paper key={index} shadow="xs" p="md">
              <Text weight={300} style={{ fontSize: 14 }} color="grey">
                from:{" "}
                <span style={{ color: "blue" }}>
                  {" "}
                  {formatAddress(chat.sender)}
                </span>
              </Text>
              <Text weight={300} style={{ fontSize: 12 }} color="grey">
                {new Date(
                  parseInt(chat.timestamp._hex, 16) * 1000
                ).toLocaleString()}
              </Text>

              <Text>{chat.message}</Text>
              <Text weight={300} size="md">
                {chat.seen ? (
                  <Text weight={300} size="md" color="green">
                    seen
                  </Text>
                ) : (
                  <>
                    <Text
                      weight={300}
                      size="md"
                      color="red"
                      style={{ fontSize: 14, fontWeight: 600 }}
                    >
                      Not seen
                    </Text>
                  </>
                )}
              </Text>
              <Anchor>
                <PostReplyComponent />
              </Anchor>
            </Paper>
          ))}
        </Container>
      ) : (
        <>
          <Text align="center">"No chats"</Text>
          <Text align="center">
            <small
              style={{ color: "green", fontSize: 12, textAlign: "center" }}
            >
              {" "}
              use this section to send tasks to your favourite freelancers, must
              have their wallet adress{" "}
            </small>
          </Text>
        </>
      )}
    </div>
  );
};

// export const ViewDescriptionAndBidPage: React.FC = () => {
//   const params = useParams();
//   const [clientJobs, setClientJobs] = useState<any[]>([]); // Use the appropriate type
//   const [chats, setChats] = useState<any>(null);
//   const contractAddress = config["0xe704"].contractAddress;
//   const contractABI = KaziKrypto.abi;
//   const [fileURLs, setFileURLs] = useState(null);
//   const [budget, setBudget] = useState<number>();
//   const [imagesValue, setImagesValue] = useState<File[]>([]);
//   const [description, setDescription] = useState("");
//   const [bids, setBids] = useState<any[]>([]);
//   const { accountId } = useAccountId();
//   const {
//     dispatch,
//     state: {
//       status,
//       isMetaMaskInstalled,
//       wallet,
//       balance,
//       chainId,
//       walletContainer,
//     },
//   } = useMetaMask();

//   const OnChangeMFile = async (selectedFiles: File[]) => {
//     // Placeholder logic: Upload files to IPFS
//     const uploadedUrls: string[] = [];

//     for (const file of selectedFiles) {
//       const response = await uploadToIPFS(file); // Your actual IPFS upload function
//       uploadedUrls.push(response);
//     }

//     // Placeholder logic: Handle changes, such as updating URLs
//     console.log("Uploaded URLs:", uploadedUrls);
//     setFileURLs(uploadedUrls); // Assuming you have a state to store the URLs
//   };

//   const handleMakeBidding = async () => {
//     if (!isMetaMaskInstalled) {
//       // MetaMask not installed, show a message or prompt the user to install/connect
//       console.error("Hitilafu kwenye kutuma kazi ya mteja");
//       return;
//     }
//     const provider = new ethers.providers.Web3Provider(
//       window.ethereum as unknown as ethers.providers.ExternalProvider
//     );
//     const signer = provider.getSigner();

//     const contractInstance = new ethers.Contract(
//       contractAddress,
//       contractABI,
//       signer
//     );

//     try {
//       // console.log(params.jobId);
//       const tx = await contractInstance.makeABidding(
//         ethers.BigNumber.from(params.jobId),
//         description,
//         ethers.BigNumber.from(budget),
//         fileURLs
//       );
//       await tx.wait();
//       console.log("client bid successful");
//       notifications.show({
//         title: "Successful",
//         message: "bid done successful",
//       });
//     } catch (e) {
//       console.error("Error posting client job:", e);
//     }
//   };

//   useEffect(() => {
//     const ethereumProviderInjected = typeof window.ethereum !== "undefined";
//     const isMetaMaskInstalled =
//       ethereumProviderInjected && Boolean(window.ethereum.isMetaMask);

//     if (isMetaMaskInstalled) {
//       const provider = new ethers.providers.Web3Provider(
//         window.ethereum as unknown as ethers.providers.ExternalProvider
//       );
//       const contractInstance = new ethers.Contract(
//         contractAddress,
//         contractABI,
//         provider
//       );

//       async function callViewFunction() {
//         try {
//           const result = await contractInstance.getBids(params.jobId);
//           // console.log(result);
//           // console.log("holla");
//           setBids(result);
//         } catch (error) {
//           console.error("Error calling view function:", error);
//         }
//       }
//       callViewFunction();
//     }
//   }, [contractAddress, contractABI]);

//   console.log("am here", bids);
//   // console.log("haloooooooooooooooo")

//   async function approveBid(bidId) {
//     try {
//       const ethereumProviderInjected = typeof window.ethereum !== "undefined";
//       const isMetaMaskInstalled =
//         ethereumProviderInjected && Boolean(window.ethereum.isMetaMask);

//       if (isMetaMaskInstalled) {
//         const provider = new ethers.providers.Web3Provider(
//           window.ethereum as unknown as ethers.providers.ExternalProvider
//         );

//         const signer = provider.getSigner(); // Get the connected signer
//         const contract = new ethers.Contract(
//           contractAddress,
//           contractABI,
//           signer
//         );

//         const jobId = parseInt(params.jobId); // Make sure jobId is in the right format

//         const transaction = await contract.acceptBid(jobId, bidId);

//         await transaction.wait(); // Wait for the transaction to be mined
//         console.log("Bid accepted successfully!");
//       }
//     } catch (error) {
//       console.error("Error approving bid:", error);
//     }
//   }

//   useEffect(() => {
//     const ethereumProviderInjected = typeof window.ethereum !== "undefined";
//     const isMetaMaskInstalled =
//       ethereumProviderInjected && Boolean(window.ethereum.isMetaMask);

//     if (isMetaMaskInstalled) {
//       const provider = new ethers.providers.Web3Provider(
//         window.ethereum as unknown as ethers.providers.ExternalProvider
//       );
//       const contractInstance = new ethers.Contract(
//         contractAddress,
//         contractABI,
//         provider
//       );

//     const signer = provider.getSigner();

//     async function fetchChats() {
//       try {
//         const result = await contractInstance.getChats(
//           signer,
//         );
//         setChats(result);
//       } catch (error) {
//         console.error("Error fetching portfolio:", error);
//       }
//     }

//     fetchChats();
// }
//   }, [contractAddress, contractABI]);

//   // const rows = bids ? bids.map((bid, index) => (
//   //   <tr key={index}>
//   //     bid
//   //   </tr>
//   // )): "no bids yet";

//   return (
//     <>
//       {chats.length > 0 ? (
//         <Container>
//           {chats.map((chat, index) => (
//             <Card
//               key={index}
//               shadow="sm"
//               sx={{ marginBottom: 20 }}
//               padding="lg"
//               radius="md"
//               withBorder
//             >
//               <Text weight={300} size="md">
//                 chat from: {chat.sender}
//               </Text>
//               <Text weight={300} size="md">
//                 chat from: {chat.receiver}
//               </Text>
//               <br />
//               <Text weight={300} size="md">
//                 time: {chat.timestamp.toString()} ETH
//               </Text>
//               <Text weight={300} size="md">
//                 Mesage: {chat.message}
//               </Text>
//               <br />

//               <Text weight={300} size="md">
//                 {chat.seen ? (
//                   <Text weight={300} size="md" color="green">
//                     Approved
//                   </Text>
//                 ) : (
//                   <>
//                     <Text
//                       weight={300}
//                       size="md"
//                       color="red"
//                       style={{ fontSize: 14, fontWeight: 600 }}
//                     >
//                       Not seen
//                     </Text>
//                   </>
//                 )}
//               </Text>
//             </Card>
//           ))}
//         </Container>
//       ) : (
//         "No chats"
//       )}
//       <br />
//       {bids.length > 0 ? (
//         <Container>
//           {bids.map((bid, index) => (
//             <Card
//               key={index}
//               shadow="sm"
//               sx={{ marginBottom: 20 }}
//               padding="lg"
//               radius="md"
//               withBorder
//             >
//               <Text weight={300} size="md">
//                 Bid from: {bid.accountId}
//               </Text>
//               <br />
//               <Text weight={300} size="md">
//                 Amount: {bid.budget.toString()} ETH
//               </Text>
//               <Text weight={300} size="md">
//                 Bid Mesage: {bid.bidDescription}
//               </Text>
//               <br />

//               <Text weight={300} size="md">
//                 {bid.bidApproved ? (
//                   <Text weight={300} size="md" color="green">
//                     Approved
//                   </Text>
//                 ) : (
//                   <>
//                     <Text
//                       weight={300}
//                       size="md"
//                       color="red"
//                       style={{ fontSize: 14, fontWeight: 600 }}
//                     >
//                       Not Approved
//                     </Text>
//                     {singleJob ? (
//                       bid.accountId === singleJob.accountId ? (
//                         <Button onClick={() => approveBid(bid.bidId)}>
//                           Approved Bid
//                         </Button>
//                       ) : (
//                         " "
//                       )
//                     ) : (
//                       <Text>No Single Job</Text>
//                     )}
//                   </>
//                 )}
//               </Text>
//             </Card>
//           ))}
//         </Container>
//       ) : (
//         "No bids"
//       )}
//     </>
//   );
// };

export default ViewChatsComponent;
