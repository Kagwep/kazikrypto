// SPDX-License-Identifier: MIT
pragma solidity >=0.4.1 < 0.9.0;

/**
* @title Kazi Krypto
* @notice The contract a freelancing platform on the Ethereum blockchain
* @notice The platform aims to connect freelancers and clients, facilitating secure and
transparent transactions while leveraging the benefits of blockchain technology

* @dev user Registration and profiles
* @dev Job posting and bidding
* @dev Smart contract escrow
* @dev messaging and collaboration
* @dev reputation and reviews
* @dev payment and escrow release
* @dev transaction history and analytics
* @dev conflict resolution
 */
 

contract KaziKrypto {

    address owner;
    /**
    * @dev allow smart contract to receive payments
    */
    
    constructor() payable {
        owner == msg.sender;  
    }


    /// @title Freelancer Profile
    /// @dev Struct to store user profile
    struct Freelancer {
        address payable accountId;
        string profileImage;
        string fullName;
        uint hourlyRate;
        string profession;
        string paymentPreference;
        string[] skills;
        uint profileRating;
        bool isProfilePublic;
    }

    struct Disputes {
        string disputeName;
        string description;
        address disputor;
        address clientInvolved;
        bool resolved;
    }

    Disputes[] disputes;

    /// @title freelancer portfolio
    /// @notice all portfolios mapped to the specific freelancer Id
    struct FreelancerPortfolio {
        address accountId;
        string[] images; /// @dev optional
        string[] videos; /// @dev optional
        string taskUrl;
        string description;
    }

    /// @title freelancer experience
    /// @dev store freelancer experience
    struct FreelancerExperience {
        address accountId;
        string fromDate;
        string toDate;
        string jobTitle;
        string jobDescription;
    }

    /// @title Job posting and bidding
    /// @dev struct to store job requirements
    struct ClientJobs {
        uint jobId;
        address accountId;
        string projectTitle;
        string projectDescription;
        string projectDuration;
        uint projectBudget;
        string[] skillRequirements;
        string[] images; ///@dev optional
        bool bidAvailable;
    }

    /// @title FreelancerBids;
    /// @dev store each freelancerBid
    /// @dev make a reference to the account Id of the freelancer
    struct FreelancerBids {
        uint jobId;
        uint bidId;
        address accountId;
        string bidDescription;
        uint budget;
        string[] relevantFiles; /// @dev optional
        bool bidApproved;
    }

    uint private clientBidId;

    /// @title Milestones
    /// @dev allow frelancer to bid in form of milestones
    /// @dev optional

    struct ProjectMilestones {
        uint bidId;
        uint mileStoneId;
        string milestoneName;
        string milestoneDescription;
        uint milestoneBudget;
        uint milestoneDuration;
        bool milestoneWorkApproved;
    }

    uint private mileStoneId;

    /// @title Chats
    /// @dev chat from intended sender to intended receiver

    struct Chats {
        uint timestamp;
        address sender;
        address receiver;
        string message;
        string[] attachedFiles; /// @dev optional
        bool seen;
    }

    /// @title client ratings
    /// @dev single client Rating
    /// @dev done by the freelancer

    struct ClientRatings {
        uint bidId;
        string ProjectName; /// @dev optional
        address accountId;
        string feedback; /// @dev optional
        uint ratingForTimelyPayments; /// @dev maximum 5
        uint ratingForTimelyFeedbacks; /// @dev maximum 5
    }

    /// @title freelancerr Ratings
    /// @dev single freelancer Rating

    struct FreelancerRatings {
        uint bidId;
        string ProjectName; /// @dev optional;
        address accountId; 
        string feedback; /// @dev optional;
        uint ratingForCompletedProjects; /// @dev max 5;
        uint ratingForCommunicationSkills; /// @dev max 5;
    }

    /// @title Transaction History
    /// @dev store transaction history
    struct Transaction {
        address payable from;
        address payable to;
        string transactionPurpose;
        uint transactionAmount;
        uint timestamp;
        string transactionStatus;
    }

    mapping(address => Transaction[]) transactions;

    /// @dev freelancer detail storage
    /// @dev store personal details
    /// @dev store each freelancer portfolio
    /// @dev store freelancer experience
    /// @dev store freelancer ratings;
    /// @dev everybody is a freelancer 
    /// @dev current project milestones
    mapping(address => Freelancer) freelancers;
    mapping(address => FreelancerPortfolio[]) freelancerPortfolios;
    mapping(address => FreelancerExperience[]) freelancerExperiences;
    mapping(address => FreelancerRatings[]) freelancerRatings;
    mapping(address => ProjectMilestones[]) milestonesInAccount;

    /// @dev client detail storage
    /// @dev store Client Jobs
    /// @dev not everybody is a client
    uint internal clientJobId;
    ClientJobs[] public allClientJobs;

    mapping(uint => ClientJobs) public clientJobsById;
    mapping(uint => FreelancerBids[]) allBidsForClientJobs;

    /// @dev acceptedBidDetail
    /// @dev storage done here if the data stored above has been validated
    mapping(uint => ProjectMilestones[]) projectMilestonesForAcceptedBids;


    /// @dev Chat storage;
    mapping(address => Chats[]) freelancerChats;

    /**
    * @param _fullName full names for freelancer
    * @param _profession he inputs his profession
    * @param _preferredPayment he fills his preferred payment
    * @param _skill he fills in his skills
    * @dev rating is automatically filled for the first time as 0
    * @notice after logging in for the first time update details here
     */



    function addNewFreelancer(string memory _fullName,string memory _profileImage, uint _hourlyRate,string memory _profession, string memory _preferredPayment, string[] memory _skill, bool _isProfilePublic)public{
        /// @dev validate inputs
        // require(_fullName.length > 0, "enter_name");
        // require(_profession.length > 0, "enter_profession");
        // require(_preferredPayment.length > 0, "enter_preferred_payment");
        // require(_skill.length > 0, "enter_one_skill");

        /// @dev make the storage
        freelancers[msg.sender] = Freelancer(payable(msg.sender),_profileImage, _fullName,_hourlyRate,  _profession, _preferredPayment, _skill, 0, _isProfilePublic); 
    }

    /**
     * @notice Allows freelancers to update their profile information
     * @param _fullName Updated full names for freelancer
     * @param _hourlyRate Updated hourly rate
     * @param _profession Updated profession
     * @param _preferredPayment Updated preferred payment
     * @param _skills Updated skills
     */
    function editFreelancerProfile(string memory _fullName, uint _hourlyRate, string memory _profession, string memory _preferredPayment, string[] memory _skills) public {
        Freelancer storage freelancer = freelancers[msg.sender];
        freelancer.fullName = _fullName;
        freelancer.hourlyRate = _hourlyRate;
        freelancer.profession = _profession;
        freelancer.paymentPreference = _preferredPayment;
        freelancer.skills = _skills;
    }

    /**
     * @notice Allows freelancers to set their profile visibility status
     * @param _isProfilePublic Boolean indicating if the profile is public (true) or private (false)
     */
    function setProfileVisibility(bool _isProfilePublic) public {
        freelancers[msg.sender].isProfilePublic = _isProfilePublic;
    }

    function getFreelancer(address _freelancerAddress) public view returns (Freelancer memory) {
        return freelancers[_freelancerAddress];
    }

    /**
    * @notice adds portfolio to an existing freelancer profile
    * @param _images images involved
    * @param _description description involved | optional
    * @param _taskurl url to the task | optional
    * @param _videos videos involved if any
    * 
     */

     function addPortfolio(string[] memory _images, string[] memory _videos, string memory _taskurl, string memory _description) public {
        freelancerPortfolios[msg.sender].push(FreelancerPortfolio(msg.sender, _images, _videos, _taskurl, _description));
     }


    function getPortfolio(address _freelancerAddress, uint256 _index) public view returns (FreelancerPortfolio memory) {
        return freelancerPortfolios[_freelancerAddress][_index];
    }
     /**
     * @notice adds experiences to a freelancer account
     * @param _fromDate date started
     * @param _toDate date ended, // optional if still working
     * @param _jobTitle role of the freelancer
     * @param _jobDescription description of the job
     */

     function addFreelancerExperience(string memory _fromDate, string memory _toDate, string memory _jobTitle, string memory _jobDescription)public{
        freelancerExperiences[msg.sender].push(FreelancerExperience(msg.sender, _fromDate, _toDate, _jobTitle, _jobDescription));
     }

    function getExperience(address _freelancerAddress, uint256 _index) public view returns (FreelancerExperience memory) {
        return freelancerExperiences[_freelancerAddress][_index];
    }


    /**
    * @dev anyone can do this
    * @dev one has to fully pay for the task when posting to ensure integrity of the DAPP
    * @param _projectTitle title of the task
    * @param _projectDescription description of the project
    * @param _projectDuration should be in range of dates
    * @param _projectBudget should be more than 0
    * @param _skillRequirements at least one
    * @param _images if any*/
     function postAClientJob(string memory _projectTitle, string memory _projectDescription, string memory _projectDuration, uint _projectBudget, string[] memory _skillRequirements, string[] memory _images) public payable {
        address payable contractAddress = payable(address(this));
        (bool sent, bytes memory data) = contractAddress.call{value: msg.value}("");
        clientJobId++;
        allClientJobs.push(ClientJobs(clientJobId, msg.sender, _projectTitle, _projectDescription, _projectDuration, _projectBudget, _skillRequirements, _images, true));
        ClientJobs memory newClientJob = ClientJobs(clientJobId, msg.sender, _projectTitle, _projectDescription, _projectDuration, _projectBudget, _skillRequirements, _images, true);
        clientJobsById[clientJobId] = newClientJob;
        transactions[msg.sender].push(Transaction(payable(msg.sender), contractAddress, "Project posting", msg.value, block.timestamp, "on_escrow"));
     }

    //  function getAllClientJobs() public view returns (ClientJobs[] memory){
    //     return allClientJobs;
    //  } 


    function getClientJob() public view returns (ClientJobs[] memory) {
       
        return allClientJobs;
    }

    // Function to get a client job by its jobId
    function getClientJobById(uint jobId) public view returns (ClientJobs memory) {
        return clientJobsById[jobId];
    }
    /**
    * @dev makeAbidding
    * @dev only occurs on existing project id
    * @param _jobid id for  the job description
    * @param _bidDescription auto generated id for bid description
    * @param _budget freelancer budget for bid description
    * @param _relevantFiles if the freelancer needs to upload relevant files to justify his bidding */
     function makeABidding(uint _jobid, string memory _bidDescription, uint _budget, string[] memory _relevantFiles) public {
        uint internalBidCounter;
        for(uint i = 0; i < allBidsForClientJobs[_jobid].length; i++){
            if(allBidsForClientJobs[_jobid][i].accountId == msg.sender){
                revert("allready_made_bid");
            }
        }

        for (uint i = 0; i < allClientJobs.length; i++) {
            if(allClientJobs[i].jobId == _jobid){
                clientBidId++;
                internalBidCounter++;
                allBidsForClientJobs[_jobid].push(FreelancerBids(_jobid, clientBidId, msg.sender, _bidDescription, _budget, _relevantFiles, false));
            }
        }

        if(internalBidCounter < 1){
            revert("bid_doesnt_exist");
        }
     }

    function getBid(uint256 _jobid, uint256 _bidId) public view returns (FreelancerBids memory) {
        require(_bidId > 0 && _bidId <= clientBidId, "Invalid bid ID");
        FreelancerBids[] memory bids = allBidsForClientJobs[_jobid];
        for (uint256 i = 0; i < bids.length; i++) {
            if (bids[i].bidId == _bidId) {
                return bids[i];
            }
        }
        revert("Bid not found");
    }

    function getBids(uint256 _jobid) public view returns (FreelancerBids[] memory) {
        return allBidsForClientJobs[_jobid];
    }


     function chat(address _receiver, string memory _message, string[] memory _attachedFiles) public {
        freelancerChats[_receiver].push(Chats(block.timestamp, msg.sender, _receiver, _message, _attachedFiles, false));
     }

     function markAsRead(address _receiver)public{
        for(uint i = 0; i < freelancerChats[_receiver].length; i++){
            if(freelancerChats[_receiver][i].sender == msg.sender){
                freelancerChats[_receiver][i].seen = true;
            }
        }
     }

    function getChat(address _receiver, uint _index) public view returns (
        uint timestamp,
        address sender,
        address receiver,
        string memory message,
        string[] memory attachedFiles,
        bool seen
    ) {
        Chats memory chat = freelancerChats[_receiver][_index];
        return (
            chat.timestamp,
            chat.sender,
            chat.receiver,
            chat.message,
            chat.attachedFiles,
            chat.seen
        );
    }

    function getChats(address _receiver) public view returns (Chats[] memory) {
        return freelancerChats[_receiver];
    }

    function acceptBid(uint _jobId, uint _bidId) public {
        for(uint i = 0; i < allBidsForClientJobs[_jobId].length; i++){
            if(allBidsForClientJobs[_jobId][i].bidId  == _bidId){
                if(allBidsForClientJobs[_jobId][i].bidApproved == true){
                    revert("bid_allready_approved");
                }else{
                    allBidsForClientJobs[_jobId][i].bidApproved = true;
                }
            }
        }
        for(uint i = 0; i < allClientJobs.length; i++){
            if(allClientJobs[i].jobId == _jobId){

                if(allClientJobs[i].bidAvailable == false){
                    revert("bid not available");
                }else{
                    allClientJobs[i].bidAvailable = false;
                }
            }
        }
    }

    function addProjectMileStone(uint _jobId, uint _bidId, string memory _milestoneName, string memory _mileStoneDescription, uint _mileStoneBudget, uint _mileStoneDuration) public {
        uint remaining_budget;
        uint dataPosition;
         for(uint i = 0; i < allBidsForClientJobs[_jobId].length; i++){
           if(allBidsForClientJobs[_jobId][i].bidId == _bidId && allBidsForClientJobs[_jobId][i].bidApproved == true){
            remaining_budget = allBidsForClientJobs[_jobId][i].budget;
            dataPosition = i;
           }
        }



        if(remaining_budget < _mileStoneBudget){
            revert('budget_overpriced');
        }else if(allBidsForClientJobs[_jobId][dataPosition].bidApproved == false){
            revert('bid_not_approved');
        }
        else{
            mileStoneId++;
            allBidsForClientJobs[_jobId][dataPosition].budget -= _mileStoneBudget;
            ///@dev will be used for freelancer rating purposes
            milestonesInAccount[msg.sender].push(ProjectMilestones(_bidId,mileStoneId, _milestoneName, _mileStoneDescription, _mileStoneBudget, _mileStoneDuration, false));

            ///@dev will be used for client project management
            projectMilestonesForAcceptedBids[_bidId].push(ProjectMilestones(_bidId,mileStoneId, _milestoneName, _mileStoneDescription, _mileStoneBudget, _mileStoneDuration, false));
        }
    }

    
   

    function approveProjectMilestone(address payable _freelancer, uint _mileStoneId)public {
        uint bidId;
        address jobOwner;
        /// @dev making sure only the project owner can make the approval


        for(uint i = 0; i < allClientJobs.length; i++){
            if(allClientJobs[i].accountId == msg.sender){
                jobOwner = msg.sender;
            }
        }

        if(jobOwner != msg.sender){
            revert("only_job_owner");
        }
        

        for(uint i = 0; i < milestonesInAccount[_freelancer].length; i++){
            if(milestonesInAccount[_freelancer][i].mileStoneId == _mileStoneId && milestonesInAccount[_freelancer][i].milestoneWorkApproved == false && jobOwner == msg.sender) {
                bidId = milestonesInAccount[_freelancer][i].bidId;
                address payable contractAddress = payable(address(this));
                milestonesInAccount[_freelancer][i].milestoneWorkApproved = true;
                _freelancer.transfer(milestonesInAccount[_freelancer][i].milestoneBudget);
                transactions[_freelancer].push(Transaction(contractAddress, _freelancer, "Approval",milestonesInAccount[_freelancer][i].milestoneBudget , block.timestamp, "settled"));
            }
        }



        for(uint i = 0; i < projectMilestonesForAcceptedBids[bidId].length; i++){
            if(projectMilestonesForAcceptedBids[bidId][i].mileStoneId == _mileStoneId){
                projectMilestonesForAcceptedBids[bidId][i].milestoneWorkApproved = true;
            }
        } 
    }

    /// @dev displays a freelancer milestone at profile Mode
    function getFreelancerMileStones(address _accountId) public view returns(ProjectMilestones[] memory){
        return milestonesInAccount[_accountId];
    }

    /// @dev displays freelancer milestone in Project mode
    function getProjectMileStones(uint _bidId) public view returns (ProjectMilestones[] memory){
        return projectMilestonesForAcceptedBids[_bidId];
    }

    /// @dev display freelancer transaction at profile Mode
    function getFreelancerTransactions(address _accountId) public view returns(Transaction[] memory){
        return transactions[_accountId];
    }

    /// @dev rate a freelancer
    function rateAfreelancer(address _accountId, uint _bidId,string memory _projectName, string memory _feedBack, uint _ratingForCompletedProjects, uint _ratingForCommunicationSkills) public {
        uint isRated = 0;
        for(uint i = 0; i < freelancerRatings[_accountId].length; i++){
            if(freelancerRatings[_accountId][i].bidId == _bidId){
                isRated += 1;
            }
        }

        if(isRated == 0){
            freelancerRatings[_accountId].push(FreelancerRatings(_bidId, _projectName, _accountId, _feedBack, _ratingForCompletedProjects, _ratingForCommunicationSkills));
        }else{
            revert("allready rated");
        }
    }
    /// @dev view freelancer rating

    function viewFreelancerRating(address _accountId) public view returns(FreelancerRatings[] memory){
        return freelancerRatings[_accountId];
    }

    /// @dev disputes handling
    function createDispute(string memory _disputeName, string memory _description, address _clientInvolved) public {
        for(uint i = 0; i < disputes.length; i++){
            if(disputes[i].disputor == msg.sender && disputes[i].resolved == false){
                revert("solve_your_dispute_first");
            }
        }
        disputes.push(Disputes(_disputeName, _description, msg.sender, _clientInvolved, false));
    }

    modifier onlyOwner {
        require(owner == msg.sender, "only_owner");
        _;
    }

    function markDisputeAsResolved(address _disputor) public onlyOwner {
        for(uint i = 0; i < disputes.length; i++){
            if(disputes[i].disputor == _disputor && disputes[i].resolved == false){
                disputes[i].resolved = true;
            }
        }
    }


    function getDispute(uint index) public view returns (Disputes memory) {
        require(index < disputes.length, "Invalid index");
        return disputes[index];
    }

    function getAllDisputes() public view returns (Disputes[] memory) {
        return disputes;
    }
}