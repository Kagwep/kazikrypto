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
  Checkbox,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { config, isSupportedNetwork } from "../../lib/config";
import KaziKrypto from "../../../../contract/build/contracts/KaziKrypto.json"; // Replace with the actual path to your config file

const AddFreelancerComponent: React.FC = () => {
  const [data, setData] = useState([
    { value: "react", label: "React" },
    { value: "ng", label: "Angular" },
  ]);
  const [fullName, setFullName] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [hourlyRate, setHourlyRate] = useState(0);
  const [profession, setProfession] = useState("");
  const [paymentPreference, setPaymentPreference] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [isProfilePublic, setIsProfilePublic] = useState(false);

  const contractAddress = config["0xe704"].contractAddress;

  const provider = new ethers.providers.Web3Provider(
    window.ethereum as unknown as ethers.providers.ExternalProvider
  );
  const signer = provider.getSigner();
  // console.log(signer)

  const networkId = import.meta.env.VITE_PUBLIC_NETWORK_ID;

  if (!isSupportedNetwork(networkId)) {
    throw new Error("unsurported network , tafadhali nani fuata maelekezo");
  }

  const contractInstance = new ethers.Contract(
    contractAddress,
    KaziKrypto.abi,
    signer
  );

  const handleAddFreelancer = async () => {
    try {
      const tx = await contractInstance.addNewFreelancer(
        fullName,
        profileImage,
        hourlyRate,
        profession,
        paymentPreference,
        skills,
        isProfilePublic
      );

      await tx.wait();
      console.log("Freelancer added successfully!");
      notifications.show({
        title: "Successful",
        message: "Profile Updated successfully",
      });
    } catch (error) {
      console.error("Error adding freelancer:", error);
    }
  };

  return (
    <div>
      <form>
        {/* <label>Full Name:</label>
        <input type="text" /> */}
        <Container size="30rem">
          <h6>Edit Profile</h6>
          <Paper sx={{ padding: 10 }}>
            <TextInput
              onChange={(e) => {
                setFullName(e.target.value);
                console.log(fullName);
              }}
              value={fullName}
              label="Full Name"
              placeholder="eg Felix Awere"
            />

            {/* <label>Profile Image:</label> */}
            <TextInput
              label="Profile image"
              value={profileImage}
              onChange={(e) => setProfileImage(e.target.value)}
            />

            {/* <label>Hourly Rate:</label> */}
            <NumberInput
              label="Hourly Rate"
              defaultValue={1000}
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              formatter={(value) =>
                !Number.isNaN(parseFloat(value))
                  ? `$ ${value}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
                  : "$ "
              }
              onChange={(value: number) => setHourlyRate(value)}
            />

            {/* <label>Profession:</label> */}
            <TextInput
              label="Profession"
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
            />

            {/* <label>Payment Preference:</label> */}
            <TextInput
              label="Payment Preference"
              value={paymentPreference}
              onChange={(e) => setPaymentPreference(e.target.value)}
            />

            {/* <label>Skills (comma-separated):</label> */}
            <MultiSelect
              label="Skills"
              data={data}
              placeholder="Select items"
              searchable
              creatable
              getCreateLabel={(query) => `+ Create ${query}`}
              onCreate={(query) => {
                const item = { value: query, label: query };
                setData((current) => [...current, item]);
                return item;
              }}
              onChange={(value: string[]) => {
                setSkills(value);
                console.log(skills);
              }}
            />

            {/* <label>Profile Public:</label> */}
            {/* <input
              type="checkbox"
              checked={isProfilePublic}
              onChange={(e) => setIsProfilePublic(e.target.checked)}
            /> */}
            <br />
            <Checkbox
              checked={isProfilePublic}
              onChange={(e) => setIsProfilePublic(e.target.checked)}
              label="Is your Profile public"
            />
            <br />
            <Button uppercase onClick={handleAddFreelancer}>
              Update
            </Button>
          </Paper>
        </Container>
      </form>
    </div>
  );
};

export default AddFreelancerComponent;
