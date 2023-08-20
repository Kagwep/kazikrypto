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
import { useNavigate, useParams } from "react-router-dom";

const items: { title: string; linkTo: string }[] = [
  { title: "my Profile", linkTo: "view-profile" },
  { title: "my portfolio", linkTo: "my-portfolio" },
  { title: "my Experience", linkTo: "view-profile" },
];

interface Milestones {
  jobId: string;
  singleJob: any;
  bidId:string;
}

const Milestones: React.FC<Milestones> = ({ jobId, singleJob, bidId }) => {
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  const { x, y } = useParams();
  console.log(x, y);
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
        <Tabs defaultValue="milestones">
          <Tabs.List>
            <Tabs.Tab
              value="milestones"
              icon={<IconMessageCircle size="0.8rem" />}
            >
              Milestones
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="milestones">
            <br />
            <GetMilestonesComponent
              freelancerAddress={connectedAddress}
              jobId={jobId}
              singleJob={singleJob}
              bidId={bidId}
            />
            <br />
          </Tabs.Panel>
        </Tabs>
      </Container>
    </div>
  );
};

export default Milestones;
