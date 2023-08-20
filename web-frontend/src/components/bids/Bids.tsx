import { Tabs, Container } from "@mantine/core";
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
import GetBidsComponent from "../display/DisplayBids";
import GetMilestonesComponent from "../display/DisplayMilestones";

const items: { title: string; linkTo: string }[] = [
  { title: "my Profile", linkTo: "view-profile" },
  { title: "my portfolio", linkTo: "my-portfolio" },
  { title: "my Experience", linkTo: "view-profile" },
];

interface Bids {
  jobId: string;
  singleJob: any;
}

const Bids: React.FC<Bids> = ({  jobId, singleJob }) => {
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
        <Tabs defaultValue="bids">
          <Tabs.List>
            <Tabs.Tab value="bids" icon={<IconPhoto size="0.8rem" />}>
              Bids
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="bids">
            <br />
            <GetBidsComponent
              freelancerAddress={connectedAddress}
              jobId={jobId}
              singleJob={singleJob}
            />
          </Tabs.Panel>
        </Tabs>
      </Container>
    </div>
  );
};

export default Bids;
