const KaziKrypto = artifacts.require("KaziKrypto");
const chai = require("chai");
const BN = require("bn.js");
const chaiBN = require("chai-bn")(BN);
chai.use(chaiBN);
const { expect } = chai;
const { default: Web3 } = require("web3");

// import "../contracts/Opeations.sol";
const web3 = new Web3("HTTP://127.0.0.1:7545");

contract("KaziKrypto", (accounts) => {
  const owner = accounts[0];
  const client = accounts[1];
  const disputor = accounts[2];

  let instance;

  beforeEach(async () => {
    instance = await KaziKrypto.deployed();
  });

  it("should add a new freelancer", async () => {
    const fullName = "John Doe";
    const image = "path_to_image";
    const hourlyRate = new BN(50);
    const profession = "Software Engineer";
    const preferredPayment = "ETH";
    const skills = ["JavaScript", "Solidity", "Web3"];

    // Call the addNewFreelancer function
    await instance.addNewFreelancer(
      fullName,
      image,
      hourlyRate,
      profession,
      preferredPayment,
      skills,
      { from: accounts[0] }
    );

    // Retrieve the added freelancer using the getFreelancer function
    const freelancer = await instance.getFreelancer(accounts[0]);

    // Check if the data is correct
    expect(freelancer.accountId).to.equal(accounts[0]);
    expect(freelancer.fullName).to.equal(fullName);
    expect(freelancer.hourlyRate).to.be.bignumber.equal(hourlyRate);
    expect(freelancer.profession).to.equal(profession);
    expect(freelancer.paymentPreference).to.equal(preferredPayment);
    expect(freelancer.skills).to.deep.equal(skills);
    expect(freelancer.profileRating).to.be.bignumber.equal(new BN(0));
  });

  it("should add a new portfolio to freelancer", async () => {
    const images = ["image1.png", "image2.png"];
    const videos = ["video1.mp4", "video2.mp4"];
    const taskUrl = "https://kaziKrypto.com/task";
    const description = "This is a test portfolio";

    // Call the addPortfolio function
    await instance.addPortfolio(images, videos, taskUrl, description, {
      from: accounts[0],
    });

    // Retrieve the added portfolio using the getPortfolio function
    const portfolio = await instance.getPortfolio(accounts[0], 0);

    // Check if the data is correct
    expect(portfolio.accountId).to.equal(accounts[0]);
    expect(portfolio.images).to.deep.equal(images);
    expect(portfolio.videos).to.deep.equal(videos);
    expect(portfolio.taskUrl).to.equal(taskUrl);
    expect(portfolio.description).to.equal(description);
  });

  it("should allow getFreelancer to update their profile information", async () => {
    const fullName = "John Doe";
    const image = "path_to_image";
    const hourlyRate = new BN(25);
    const profession = "Developer";
    const preferredPayment = "ETH";
    const skills = ["Solidity", "JavaScript"];

    await instance.addNewFreelancer(
      fullName,
      image,
      hourlyRate,
      profession,
      preferredPayment,
      skills,
      { from: accounts[0] }
    );

    const newFullName = "Jane Doe";
    const newHourlyRate = new BN(30);
    const newProfession = "Software Engineer";
    const newPreferredPayment = "BTC";
    const newSkills = ["Solidity", "Python"];

    await instance.editFreelancerProfile(
      newFullName,
      newHourlyRate,
      newProfession,
      newPreferredPayment,
      newSkills
    );

    const freelancer = await instance.getFreelancer(accounts[0]);

    expect(freelancer.fullName).to.equal(newFullName);
    expect(freelancer.hourlyRate).to.be.bignumber.equal(newHourlyRate);
    expect(freelancer.profession).to.equal(newProfession);
    expect(freelancer.paymentPreference).to.equal(newPreferredPayment);
    expect(freelancer.skills).to.deep.equal(newSkills);
  });

  it("should allow getFreelancer to set their profile visibility status", async () => {
    const fullName = "John Doe";
    const image = "path_to_image";
    const hourlyRate = 25;
    const profession = "Developer";
    const preferredPayment = "ETH";
    const skills = ["Solidity", "JavaScript"];

    await instance.addNewFreelancer(
      fullName,
      image,
      hourlyRate,
      profession,
      preferredPayment,
      skills,
      { from: accounts[0] }
    );

    const initialProfileVisibility = await instance.getFreelancer(accounts[0]);
    expect(initialProfileVisibility.isProfilePublic).to.be.true;

    const newProfileVisibility = false;
    await instance.setProfileVisibility(newProfileVisibility);

    const updatedProfileVisibility = await instance.getFreelancer(accounts[0]);
    expect(updatedProfileVisibility.isProfilePublic).to.equal(
      newProfileVisibility
    );
  });

  it("should add a new experience to freelancer", async () => {
    const fromDate = "2022-01-01";
    const toDate = "2022-12-31";
    const jobTitle = "Software Engineer";
    const jobDescription = "Worked on blockchain projects";

    // Call the addFreelancerExperience function
    await instance.addFreelancerExperience(
      fromDate,
      toDate,
      jobTitle,
      jobDescription,
      { from: accounts[0] }
    );

    // Retrieve the added experience using the getExperience function
    const experience = await instance.getExperience(accounts[0], 0);

    // Check if the data is correct
    expect(experience.accountId).to.equal(accounts[0]);
    expect(experience.fromDate).to.equal(fromDate);
    expect(experience.toDate).to.equal(toDate);
    expect(experience.jobTitle).to.equal(jobTitle);
    expect(experience.jobDescription).to.equal(jobDescription);
  });

  it("should post a new client job", async () => {
    const projectTitle = "Web Development";
    const projectDescription = "Build a website";
    const projectDuration = "2023-07-01 to 2023-08-30";
    const projectBudget = new BN(1000);
    const skillRequirements = ["HTML", "CSS", "JavaScript"];
    const images = ["image1.png", "image2.png"];

    // Call the postAClientJob function
    await instance.postAClientJob(
      projectTitle,
      projectDescription,
      projectDuration,
      projectBudget,
      skillRequirements,
      images,
      { from: accounts[0], value: web3.utils.toWei("1", "ether") }
    );

    // Retrieve the added client job using the getClientJob function
    const jobId = new BN(1); // Assuming it's the first job posted
    const clientJob = await instance.getClientJobById(jobId);

    // Check if the data is correct
    expect(clientJob.jobId).to.be.bignumber.equal(jobId);
    expect(clientJob.accountId).to.equal(accounts[0]);
    expect(clientJob.projectTitle).to.equal(projectTitle);
    expect(clientJob.projectDescription).to.equal(projectDescription);
    expect(clientJob.projectDuration).to.equal(projectDuration);
    expect(clientJob.projectBudget).to.be.bignumber.equal(projectBudget);
    expect(clientJob.skillRequirements).to.deep.equal(skillRequirements);
    expect(clientJob.images).to.deep.equal(images);
    expect(clientJob.bidAvailable).to.be.true;
  });

  it("should make a new bidding and retrieve it", async () => {
    const jobId = new BN(1); // Assuming it's the first job posted
    const bidDescription = "I can do this job";
    const budget = new BN(500);
    const relevantFiles = ["file1.pdf", "file2.doc"];

    // Call the makeAClientJob function
    await instance.postAClientJob(
      "Web Development",
      "Build a website",
      "2023-07-01 to 2023-08-30",
      1000,
      ["HTML", "CSS", "JavaScript"],
      ["image1.png", "image2.png"],
      { from: accounts[0], value: web3.utils.toWei("1", "ether") }
    );

    // Call the makeABidding function
    await instance.makeABidding(jobId, bidDescription, budget, relevantFiles, {
      from: accounts[1],
    });

    // Retrieve the added bid using the getBid function
    const bidId = new BN(1); // Assuming it's the first bid made
    const bid = await instance.getBid(jobId, bidId);

    // Check if the data is correct
    expect(bid.jobId).to.be.bignumber.equal(jobId);
    expect(bid.bidId).to.be.bignumber.equal(bidId);
    expect(bid.accountId).to.equal(accounts[1]);
    expect(bid.bidDescription).to.equal(bidDescription);
    expect(bid.budget).to.be.bignumber.equal(budget);
    expect(bid.relevantFiles).to.deep.equal(relevantFiles);
    expect(bid.bidApproved).to.be.false;

    // Retrieve all bids for the given job using the getBids function
    const allBids = await instance.getBids(jobId);

    // Check if the data includes the added bid
    const foundBid = allBids[bidId - 1];

    expect(foundBid).to.exist;
    expect(foundBid.accountId).to.equal(accounts[1]);
    expect(foundBid.bidDescription).to.equal(bidDescription);
    expect(foundBid.budget).to.be.bignumber.equal(budget);
    expect(foundBid.relevantFiles).to.deep.equal(relevantFiles);
    expect(foundBid.bidApproved).to.be.false;
  });

  it("should send a chat and mark as read", async () => {
    const receiver = accounts[1];
    const message = "Hello, how are you?";
    const attachedFiles = ["file1.pdf", "file2.doc"];

    // Call the chat function
    await instance.chat(receiver, message, attachedFiles, {
      from: accounts[0],
    });

    // Retrieve the chat using getChat function
    const chatIndex = 0;
    const chat = await instance.getChat(receiver, chatIndex);

    // Check if the data is correct
    expect(chat.timestamp).to.be.bignumber.gt(new BN(0));
    expect(chat.sender).to.equal(accounts[0]);
    expect(chat.receiver).to.equal(receiver);
    expect(chat.message).to.equal(message);
    expect(chat.attachedFiles).to.deep.equal(attachedFiles);
    expect(chat.seen).to.be.false;

    // Call the markAsRead function
    await instance.markAsRead(receiver, { from: accounts[0] });

    // Retrieve the chat again using getChat function
    const updatedChat = await instance.getChat(receiver, chatIndex);

    // Check if the seen status is updated
    expect(updatedChat.seen).to.be.true;
  });

  it("should get all chats for a receiver", async () => {
    const receiver = accounts[1];

    // Send multiple chats to the receiver
    await instance.chat(receiver, "Chat 1", [], { from: accounts[0] });
    await instance.chat(receiver, "Chat 2", [], { from: accounts[2] });
    await instance.chat(receiver, "Chat 3", [], { from: accounts[0] });
    await instance.chat(receiver, "Chat 4", [], { from: accounts[2] });

    // Retrieve all chats for the receiver using getChats function
    const allChats = await instance.getChats(receiver);

    // Check the number of chats and their content
    expect(allChats.length).to.equal(5);
    expect(allChats[0].sender).to.equal(accounts[0]);
    expect(allChats[1].sender).to.equal(accounts[0]);
    expect(allChats[2].sender).to.equal(accounts[2]);
    expect(allChats[3].sender).to.equal(accounts[0]);
    expect(allChats[4].sender).to.equal(accounts[2]);
  });

  it("should accept a bid for a job", async () => {
    // Define the job details
    const projectTitle = "Project Title";
    const projectDescription = "Project Description";
    const projectDuration = "2 weeks";
    const projectBudget = web3.utils.toWei("100", "ether");
    const skillRequirements = ["Skill 1", "Skill 2"];
    const images = ["Image 1", "Image 2"];
    const jobId = new BN(3);

    // Create a sample client job
    await instance.postAClientJob(
      projectTitle,
      projectDescription,
      projectDuration,
      projectBudget,
      skillRequirements,
      images,
      { from: accounts[0] }
    );

    // Retrieve the client job details
    const jobget = await instance.getClientJobById(jobId);

    // Assert that bid is initially available for the job
    assert.isTrue(jobget.bidAvailable, "Bid should be available");

    // Place a bid by a freelancer for the job

    const bidDescription = "Bid Description";
    const bidBudget = web3.utils.toWei("50", "ether");
    const relevantFiles = ["File 1", "File 2"];

    await instance.makeABidding(
      jobId,
      bidDescription,
      bidBudget,
      relevantFiles,
      { from: accounts[1] }
    );

    const bidId = new BN(2);

    // Accept the bid
    await instance.acceptBid(jobId, bidId, { from: accounts[0] });

    // Retrieve the updated bid details
    const bid = await instance.getBid(jobId, bidId);
    assert.isTrue(bid.bidApproved, "Bid should be approved");

    // Retrieve the updated client job details
    const updatedJob = await instance.getClientJobById(jobId);
    assert.isFalse(
      updatedJob.bidAvailable,
      "Bid should not be available after acceptance"
    );
  });

  it("should revert if bid is already approved", async () => {
    // Define the job details
    const jobId = 4;

    const projectTitle = "Another Project";
    const projectDescription = "Another Description";
    const projectDuration = "1 month";
    const projectBudget = web3.utils.toWei("200", "ether");
    const skillRequirements = ["Skill 3", "Skill 4"];
    const images = ["Image 3", "Image 4"];

    // Create another client job
    await instance.postAClientJob(
      projectTitle,
      projectDescription,
      projectDuration,
      projectBudget,
      skillRequirements,
      images,
      { from: accounts[0] }
    );

    // Place a bid by a freelancer for the job
    const bidId = 3;
    const bidDescription = "Another Bid Description";
    const bidBudget = web3.utils.toWei("80", "ether");
    const relevantFiles = ["File 5", "File 6"];

    await instance.makeABidding(
      jobId,
      bidDescription,
      bidBudget,
      relevantFiles,
      { from: accounts[2] }
    );

    // Accept the bid for the first time
    await instance.acceptBid(jobId, bidId, { from: accounts[0] });

    // Try to accept the bid again (should revert)
    try {
      await instance.acceptBid(jobId, bidId, { from: accounts[0] });
      assert.fail("Expected revert, but the transaction was successful");
    } catch (error) {
      assert(
        error.message.includes("bid_allready_approved"),
        "Expected revert due to bid already approved"
      );
    }
  });

  it("should revert if bid is not available for the job", async () => {
    // Define the job details
    const jobId = 4;
    const projectTitle = "Third Project";
    const projectDescription = "Description of the Third Project";
    const projectDuration = "3 weeks";
    const projectBudget = web3.utils.toWei("150", "ether");
    const skillRequirements = ["Skill 5", "Skill 6"];
    const images = ["Image 7", "Image 8"];
    // Bid not available for this job

    // Create a client job with bidAvailable set to false
    await instance.postAClientJob(
      projectTitle,
      projectDescription,
      projectDuration,
      projectBudget,
      skillRequirements,
      images,
      { from: accounts[0] }
    );

    // Place a bid by a freelancer for the job
    const bidId = 2;
    const bidDescription = "Bid for Third Project";
    const bidBudget = web3.utils.toWei("120", "ether");
    const relevantFiles = ["File 9", "File 10"];

    await instance.makeABidding(
      jobId,
      bidDescription,
      bidBudget,
      relevantFiles,
      { from: accounts[3] }
    );

    // Try to accept the bid (should revert)
    try {
      await instance.acceptBid(jobId, bidId, { from: accounts[0] });
      assert.fail("Expected revert, but the transaction was successful");
    } catch (error) {
      assert(
        error.message.includes("bid not available"),
        "Expected revert due to bid not available"
      );
    }
  });

  it("should add project milestones and approve them", async () => {
    const client = accounts[0];
    const freelancer = accounts[8];

    // Post a new client job
    const projectTitle = "Sample Project";
    const projectDescription = "This is a test project";
    const projectDuration = "2 weeks";
    const projectBudget = new BN(1000);
    const skillRequirements = ["JavaScript", "Web Development"];
    await instance.postAClientJob(
      projectTitle,
      projectDescription,
      projectDuration,
      projectBudget,
      skillRequirements,
      [],
      { from: client, value: projectBudget }
    );

    const jobId = 6;
    // Make a bid on the client job
    const bidId = 4;
    const bidDescription = "This is my bid";
    const bidBudget = new BN(800);
    await instance.makeABidding(jobId, bidDescription, bidBudget, [], {
      from: freelancer,
    });

    // Accept the bid
    await instance.acceptBid(jobId, bidId, { from: client });

    // Add project milestones for the accepted bid
    const milestoneName1 = "Milestone 1";
    const milestoneDescription1 = "This is milestone 1";
    const milestoneBudget1 = new BN(300);
    const milestoneDuration1 = 7;
    await instance.addProjectMileStone(
      jobId,
      bidId,
      milestoneName1,
      milestoneDescription1,
      milestoneBudget1,
      milestoneDuration1,
      { from: freelancer }
    );

    const milestoneName2 = "Milestone 2";
    const milestoneDescription2 = "This is milestone 2";
    const milestoneBudget2 = new BN(500);
    const milestoneDuration2 = 14;
    await instance.addProjectMileStone(
      jobId,
      bidId,
      milestoneName2,
      milestoneDescription2,
      milestoneBudget2,
      milestoneDuration2,
      { from: freelancer }
    );

    //------------------

    // Check if the milestones were added correctly
    const freelancerMilestones = await instance.getFreelancerMileStones(
      freelancer
    );
    expect(freelancerMilestones.length).to.equal(2);
    expect(freelancerMilestones[0].milestoneName).to.equal(milestoneName1);
    expect(freelancerMilestones[1].milestoneName).to.equal(milestoneName2);

    const projectMilestones = await instance.getProjectMileStones(bidId);
    expect(projectMilestones.length).to.equal(2);
    expect(projectMilestones[0].milestoneName).to.equal(milestoneName1);
    expect(projectMilestones[1].milestoneName).to.equal(milestoneName2);

    // Approve the project milestones
    await instance.approveProjectMilestone(freelancer, 1, { from: client });
    await instance.approveProjectMilestone(freelancer, 2, { from: client });

    // Check if the milestones are marked as approved
    const updatedFreelancerMilestones = await instance.getFreelancerMileStones(
      freelancer
    );
    expect(updatedFreelancerMilestones[0].milestoneWorkApproved).to.be.true;
    expect(updatedFreelancerMilestones[1].milestoneWorkApproved).to.be.true;

    const updatedProjectMilestones = await instance.getProjectMileStones(bidId);
    expect(updatedProjectMilestones[0].milestoneWorkApproved).to.be.true;
    expect(updatedProjectMilestones[1].milestoneWorkApproved).to.be.true;

    // Check the transaction history for the freelancer
    const freelancerTransactions = await instance.getFreelancerTransactions(
      freelancer
    );
    assert.equal(
      freelancerTransactions.length,
      2,
      "Incorrect number of transactions"
    );

    // Check the details of the transactions
    const transaction1 = freelancerTransactions[0];
    assert.equal(transaction1.from, freelancer, "Incorrect 'from' address");
    assert.equal(transaction1.to, instance.address, "Incorrect 'to' address");
    assert.equal(
      transaction1.transactionPurpose,
      "Project posting",
      "Incorrect transaction purpose"
    );
    assert.equal(
      transaction1.transactionAmount.toString(),
      projectBudget,
      "Incorrect transaction amount"
    );
    assert.equal(
      transaction1.transactionStatus,
      "on_escrow",
      "Incorrect transaction status"
    );

    const transaction2 = freelancerTransactions[1];
    assert.equal(
      transaction2.from,
      instance.address,
      "Incorrect 'from' address"
    );
    assert.equal(transaction2.to, freelancer, "Incorrect 'to' address");
    assert.equal(
      transaction2.transactionPurpose,
      "Approval",
      "Incorrect transaction purpose"
    );
    assert.equal(
      transaction2.transactionAmount.toString(),
      milestoneBudget1,
      "Incorrect transaction amount"
    );
    assert.equal(
      transaction2.transactionStatus,
      "settled",
      "Incorrect transaction status"
    );
  });

  it("should return an empty array for a new freelancer account", async () => {
    const freelancer = accounts[5];

    // Get the transaction history for the freelancer
    const transactions = await instance.getFreelancerTransactions(freelancer);

    // Ensure that the returned array is empty
    assert(Array.isArray(transactions), "Transactions should be an array");
    assert.equal(transactions.length, 0, "Transaction history should be empty");
  });

  it("should rate a freelancer", async () => {
    const client = accounts[0];
    const freelancer = accounts[1];
    // Rate the freelancer
    const projectName = "Sample Project";
    const feedBack = "Great work!";
    const ratingForCompletedProjects = 4;
    const ratingForCommunicationSkills = 5;
    await instance.rateAfreelancer(
      freelancer,
      1,
      projectName,
      feedBack,
      ratingForCompletedProjects,
      ratingForCommunicationSkills,
      { from: client }
    );

    // Check if the rating is added correctly
    const freelancerRatings = await instance.viewFreelancerRating(freelancer);
    assert.equal(
      freelancerRatings.length,
      1,
      "Incorrect number of freelancer ratings"
    );
    assert.equal(freelancerRatings[0].bidId, 1, "Incorrect bid ID");
    assert.equal(
      freelancerRatings[0].ProjectName,
      projectName,
      "Incorrect project name"
    );
    assert.equal(
      freelancerRatings[0].accountId,
      freelancer,
      "Incorrect freelancer account ID"
    );
    assert.equal(freelancerRatings[0].feedback, feedBack, "Incorrect feedback");
    assert.equal(
      freelancerRatings[0].ratingForCompletedProjects,
      ratingForCompletedProjects,
      "Incorrect rating for completed projects"
    );
    assert.equal(
      freelancerRatings[0].ratingForCommunicationSkills,
      ratingForCommunicationSkills,
      "Incorrect rating for communication skills"
    );
  });

  it("should revert when trying to rate a freelancer who was already rated for the same bid", async () => {
    const client = accounts[0];
    const freelancer = accounts[1];
    // Rate the freelancer for the first time
    const projectName = "Sample Project";
    const feedBack = "Great work!";
    const ratingForCompletedProjects = 4;
    const ratingForCommunicationSkills = 5;
    // Try to rate the freelancer again for the same bid
    try {
      await instance.rateAfreelancer(
        freelancer,
        1,
        projectName,
        feedBack,
        ratingForCompletedProjects,
        ratingForCommunicationSkills,
        { from: client }
      );
      assert.fail("Should have reverted");
    } catch (error) {
      assert(
        error.message.includes("allready rated"),
        "Expected revert message not received"
      );
    }
  });

  it("should create a dispute", async () => {
    const disputeName = "Dispute 1";
    const description = "This is a dispute";
    const clientInvolved = client;

    await instance.createDispute(disputeName, description, clientInvolved, {
      from: disputor,
    });

    const dispute = await instance.getDispute(0);
    assert.equal(dispute.disputeName, disputeName, "Dispute name is incorrect");
    assert.equal(dispute.description, description, "Description is incorrect");
    assert.equal(dispute.disputor, disputor, "Disputor address is incorrect");
    assert.equal(
      dispute.clientInvolved,
      clientInvolved,
      "Client involved address is incorrect"
    );
    assert.equal(dispute.resolved, false, "Dispute should not be resolved");
  });

  it("should mark a dispute as resolved by owner", async () => {
    const disputeName = "Dispute 1";
    const description = "This is a dispute";
    const clientInvolved = client;

    await instance.markDisputeAsResolved(disputor, { from: client });

    const dispute = await instance.getDispute(0);
    assert.equal(
      dispute.resolved,
      true,
      "Dispute should be marked as resolved"
    );
  });

  it("should revert when disputor tries to mark a dispute as resolved", async () => {
    const disputeName = "Dispute 1";
    const description = "This is a dispute";
    const clientInvolved = client;

    try {
      await instance.markDisputeAsResolved(disputor, { from: disputor });
      assert.fail("Should have reverted");
    } catch (error) {
      assert(
        error.message.includes("only_owner"),
        "Expected revert message not received"
      );
    }
  });

  it("should get all disputes", async () => {
    const disputeName1 = "Dispute 1";
    const description1 = "This is dispute 1";
    const clientInvolved1 = client;

    await instance.createDispute(disputeName1, description1, clientInvolved1, {
      from: disputor,
    });

    const disputeName2 = "Dispute 2";
    const description2 = "This is dispute 2";
    const clientInvolved2 = client;

    // await instance.createDispute(disputeName2, description2, clientInvolved2, {
    //   from: disputor,
    // });

    const allDisputes = await instance.getAllDisputes();
    assert.equal(allDisputes.length, 1, "Incorrect number of disputes");
    assert.equal(
      allDisputes[0].disputeName,
      disputeName1,
      "Dispute 1 name is incorrect"
    );
    // assert.equal(
    //   allDisputes[1].disputeName,
    //   disputeName2,
    //   "Dispute 2 name is incorrect"
    // );
  });

  it("should console them", async () => {
    const client = accounts[0];
    const freelancer = accounts[6];

    // Post a new client job
    const projectTitle = "Sample Project";
    const projectDescription = "This is a test project";
    const projectDuration = "2 weeks";
    const projectBudget = new BN(1000);
    const skillRequirements = ["JavaScript", "Web Development"];
    await instance.postAClientJob(
      projectTitle,
      projectDescription,
      projectDuration,
      projectBudget,
      skillRequirements,
      [],
      { from: client, value: projectBudget }
    );

    const a = await instance.getClientJob();
    console.log(a);

    // const jobId = 1;
    // // Make a bid on the client job
    // const bidId = 2;
    // const bidDescription = "This is my bid";
    // const bidBudget = new BN(800);
    // await instance.makeABidding(jobId, bidDescription, bidBudget, [], {
    //   from: freelancer,
    // });

    // // Accept the bid
    // await instance.acceptBid(jobId, bidId, { from: client });

    // // Add project milestones for the accepted bid
    // const milestoneName1 = "Milestone 1";
    // const milestoneDescription1 = "This is milestone 1";
    // const milestoneBudget1 = new BN(300);
    // const milestoneDuration1 = 7;
    // await instance.addProjectMileStone(
    //   jobId,
    //   bidId,
    //   milestoneName1,
    //   milestoneDescription1,
    //   milestoneBudget1,
    //   milestoneDuration1,
    //   { from: freelancer }
    // );

    // const milestoneName2 = "Milestone 2";
    // const milestoneDescription2 = "This is milestone 2";
    // const milestoneBudget2 = new BN(500);
    // const milestoneDuration2 = 14;
    // await instance.addProjectMileStone(
    //   jobId,
    //   bidId,
    //   milestoneName2,
    //   milestoneDescription2,
    //   milestoneBudget2,
    //   milestoneDuration2,
    //   { from: freelancer }
    // );

    // const t = await instance.milestonesInAccount(freelancer);
    // console.log(t);
  });
});
