import { Tabs,Container } from "@mantine/core";
import {
  IconPhoto,
  IconMessageCircle,
  IconSettings,
  IconArrowsExchange,
} from "@tabler/icons-react";
import AddFreelancerComponent from "../forms/AddFreeLancer";
import GetFreelancerComponent from "../display/DisplayFreelancer";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import AddPortfolioComponent from "../forms/AddPortfolio";
import GetPortfolioComponent from "../display/DisplayPortfolio";
import GetTransactionsComponent from "../display/DisplayTransactions";

const items: { title: string; linkTo: string }[] = [
  { title: "my Profile", linkTo: "view-profile" },
  { title: "my portfolio", linkTo: "my-portfolio" },
  { title: "my Experience", linkTo: "view-profile" },
];

const Profile = () => {
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  useEffect(() => {
    async function connectToWallet() {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum as unknown as ethers.providers.ExternalProvider
      );
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      console.log(address);
      setConnectedAddress(address);
    }

    connectToWallet();
  }, []);
  return (
    <div>
      <Container>
        <Tabs defaultValue="gallery">
          <Tabs.List>
            <Tabs.Tab value="gallery" icon={<IconPhoto size="0.8rem" />}>
              Update Profile
            </Tabs.Tab>
            <Tabs.Tab
              value="messages"
              icon={<IconMessageCircle size="0.8rem" />}
            >
              View Profile
            </Tabs.Tab>
            <Tabs.Tab value="settings" icon={<IconSettings size="0.8rem" />}>
              Update Portfolio
            </Tabs.Tab>
            <Tabs.Tab
              value="transactions"
              icon={<IconArrowsExchange size="0.8rem" />}
            >
              Transactions
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="gallery">
            <AddFreelancerComponent />
          </Tabs.Panel>
          <Tabs.Panel value="messages">
            <br />
            <GetFreelancerComponent freelancerAddress={connectedAddress} />
            <br />
            <GetPortfolioComponent
              freelancerAddress={connectedAddress}
              index={0}
            />
          </Tabs.Panel>
          <Tabs.Panel value="settings">
            <br />
            <AddPortfolioComponent />
          </Tabs.Panel>
          <Tabs.Panel value="transactions">
            <br />
            <GetTransactionsComponent freelancerAddress={connectedAddress} />
          </Tabs.Panel>
        </Tabs>
      </Container>
    </div>
  );
};

export default Profile;
