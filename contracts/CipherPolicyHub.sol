// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import { euint32, externalEuint32, euint8, externalEuint8, ebool, FHE } from "@fhevm/solidity/lib/FHE.sol";

contract CipherPolicyHub is SepoliaConfig {
    using FHE for *;
    
    struct Policy {
        euint32 policyId;
        euint32 premiumAmount;
        euint32 coverageAmount;
        euint32 claimLimit;
        euint32 claimCount;
        bool isActive;
        bool isVerified;
        string policyType;
        string description;
        address policyholder;
        address insurer;
        uint256 startDate;
        uint256 endDate;
    }
    
    struct Claim {
        euint32 claimId;
        euint32 claimAmount;
        euint32 policyId;
        bool isApproved;
        bool isProcessed;
        string claimType;
        string description;
        string evidenceHash;
        address claimant;
        address adjuster;
        uint256 submissionDate;
        uint256 processingDate;
    }
    
    // Simple claim structure for demo
    struct SimpleClaim {
        uint256 claimId;
        euint8 encryptedClaimType;
        euint32 encryptedAmount;
        euint32 encryptedPolicyNumber;
        euint32 encryptedContactInfo;
        euint32 encryptedDescription;
        address claimant;
        uint256 submissionDate;
        bool isActive;
    }
    
    struct Settlement {
        euint32 settlementId;
        euint32 claimId;
        euint32 settlementAmount;
        bool isCompleted;
        string settlementHash;
        address beneficiary;
        uint256 settlementDate;
    }
    
    struct RiskAssessment {
        euint32 riskScore;
        euint32 riskLevel;
        bool isVerified;
        string assessmentHash;
        address assessor;
        uint256 assessmentDate;
    }
    
    mapping(uint256 => Policy) public policies;
    mapping(uint256 => Claim) public claims;
    mapping(uint256 => Settlement) public settlements;
    mapping(address => RiskAssessment) public riskAssessments;
    mapping(address => euint32) public policyholderReputation;
    mapping(address => euint32) public insurerReputation;
    
    // Simple claims for demo
    mapping(uint256 => SimpleClaim) public simpleClaims;
    mapping(address => uint256[]) public userClaims;
    
    uint256 public policyCounter;
    uint256 public claimCounter;
    uint256 public settlementCounter;
    uint256 public simpleClaimCounter;
    
    address public owner;
    address public verifier;
    address public adjuster;
    
    event PolicyCreated(uint256 indexed policyId, address indexed policyholder, string policyType);
    event ClaimSubmitted(uint256 indexed claimId, uint256 indexed policyId, address indexed claimant);
    event ClaimProcessed(uint256 indexed claimId, bool isApproved, uint32 settlementAmount);
    event SettlementCompleted(uint256 indexed settlementId, uint256 indexed claimId, address indexed beneficiary);
    event RiskAssessed(address indexed policyholder, uint32 riskScore, bool isVerified);
    event ReputationUpdated(address indexed user, uint32 reputation);
    
    // Simple claim events for demo
    event SimpleClaimSubmitted(uint256 indexed claimId, address indexed claimant, string claimType);
    event ClaimDecrypted(uint256 indexed claimId, address indexed claimant);
    
    constructor(address _verifier, address _adjuster) {
        owner = msg.sender;
        verifier = _verifier;
        adjuster = _adjuster;
    }
    
    function createPolicy(
        string memory _policyType,
        string memory _description,
        externalEuint32 _premiumAmount,
        externalEuint32 _coverageAmount,
        uint256 _duration,
        bytes calldata inputProof
    ) public returns (uint256) {
        require(bytes(_policyType).length > 0, "Policy type cannot be empty");
        require(_duration > 0, "Duration must be positive");
        
        uint256 policyId = policyCounter++;
        
        // Convert external encrypted values to internal FHE types
        euint32 encryptedPremiumAmount = FHE.fromExternal(_premiumAmount, inputProof);
        euint32 encryptedCoverageAmount = FHE.fromExternal(_coverageAmount, inputProof);
        
        // Note: In production, coverage validation would be done off-chain
        // or using a different approach since FHE.decrypt is not available in contracts
        
        policies[policyId] = Policy({
            policyId: FHE.asEuint32(uint32(policyId)),
            premiumAmount: encryptedPremiumAmount,
            coverageAmount: encryptedCoverageAmount,
            claimLimit: FHE.asEuint32(10), // Default claim limit
            claimCount: FHE.asEuint32(0),
            isActive: true,
            isVerified: false,
            policyType: _policyType,
            description: _description,
            policyholder: msg.sender,
            insurer: address(this),
            startDate: block.timestamp,
            endDate: block.timestamp + _duration
        });
        
        // Set ACL permissions for encrypted data
        FHE.allowThis(policies[policyId].premiumAmount);
        FHE.allowThis(policies[policyId].coverageAmount);
        FHE.allowThis(policies[policyId].claimCount);
        FHE.allow(policies[policyId].premiumAmount, msg.sender);
        FHE.allow(policies[policyId].coverageAmount, msg.sender);
        FHE.allow(policies[policyId].claimCount, msg.sender);
        
        emit PolicyCreated(policyId, msg.sender, _policyType);
        return policyId;
    }
    
    function submitClaim(
        uint256 policyId,
        externalEuint32 claimAmount,
        string memory claimType,
        string memory description,
        string memory evidenceHash,
        bytes calldata inputProof
    ) public returns (uint256) {
        require(policies[policyId].policyholder == msg.sender, "Only policyholder can submit claims");
        require(policies[policyId].isActive, "Policy must be active");
        require(block.timestamp <= policies[policyId].endDate, "Policy has expired");
        
        uint256 claimId = claimCounter++;
        
        // Convert external encrypted claim amount to internal FHE type
        euint32 encryptedClaimAmount = FHE.fromExternal(claimAmount, inputProof);
        
        claims[claimId] = Claim({
            claimId: FHE.asEuint32(uint32(claimId)),
            claimAmount: encryptedClaimAmount,
            policyId: FHE.asEuint32(uint32(policyId)),
            isApproved: false,
            isProcessed: false,
            claimType: claimType,
            description: description,
            evidenceHash: evidenceHash,
            claimant: msg.sender,
            adjuster: address(0),
            submissionDate: block.timestamp,
            processingDate: 0
        });
        
        // Set ACL permissions for encrypted claim data
        FHE.allowThis(claims[claimId].claimAmount);
        FHE.allowThis(claims[claimId].policyId);
        FHE.allow(claims[claimId].claimAmount, msg.sender);
        FHE.allow(claims[claimId].policyId, msg.sender);
        
        // Update policy claim count using FHE operations
        policies[policyId].claimCount = FHE.add(policies[policyId].claimCount, FHE.asEuint32(1));
        
        emit ClaimSubmitted(claimId, policyId, msg.sender);
        return claimId;
    }
    
    function processClaim(
        uint256 claimId,
        bool isApproved,
        externalEuint32 settlementAmount,
        bytes calldata inputProof
    ) public returns (uint256) {
        require(msg.sender == adjuster, "Only adjuster can process claims");
        require(claims[claimId].claimant != address(0), "Claim does not exist");
        require(!claims[claimId].isProcessed, "Claim already processed");
        
        claims[claimId].isApproved = isApproved;
        claims[claimId].isProcessed = true;
        claims[claimId].adjuster = msg.sender;
        claims[claimId].processingDate = block.timestamp;
        
        uint256 settlementId = 0;
        
        if (isApproved) {
            settlementId = settlementCounter++;
            
            // Convert external encrypted settlement amount to internal FHE type
            euint32 encryptedSettlementAmount = FHE.fromExternal(settlementAmount, inputProof);
            
            settlements[settlementId] = Settlement({
                settlementId: FHE.asEuint32(uint32(settlementId)),
                claimId: FHE.asEuint32(uint32(claimId)),
                settlementAmount: encryptedSettlementAmount,
                isCompleted: false,
                settlementHash: "",
                beneficiary: claims[claimId].claimant,
                settlementDate: 0
            });
            
            // Set ACL permissions for settlement data
            FHE.allowThis(settlements[settlementId].settlementAmount);
            FHE.allowThis(settlements[settlementId].claimId);
            FHE.allow(settlements[settlementId].settlementAmount, claims[claimId].claimant);
            FHE.allow(settlements[settlementId].claimId, claims[claimId].claimant);
        }
        
        emit ClaimProcessed(claimId, isApproved, 0); // Amount will be decrypted off-chain
        return settlementId;
    }
    
    function completeSettlement(
        uint256 settlementId,
        string memory settlementHash
    ) public {
        require(msg.sender == adjuster, "Only adjuster can complete settlements");
        require(settlements[settlementId].beneficiary != address(0), "Settlement does not exist");
        require(!settlements[settlementId].isCompleted, "Settlement already completed");
        
        settlements[settlementId].isCompleted = true;
        settlements[settlementId].settlementHash = settlementHash;
        settlements[settlementId].settlementDate = block.timestamp;
        
        emit SettlementCompleted(settlementId, 0, settlements[settlementId].beneficiary);
    }
    
    function assessRisk(
        address policyholder,
        externalEuint32 riskScore,
        string memory assessmentHash,
        bytes calldata inputProof
    ) public {
        require(msg.sender == verifier, "Only verifier can assess risk");
        require(policyholder != address(0), "Invalid policyholder address");
        
        // Convert external encrypted risk score to internal FHE type
        euint32 encryptedRiskScore = FHE.fromExternal(riskScore, inputProof);
        
        // Simplified risk level determination
        // In production, this would be more sophisticated
        euint32 riskLevel = FHE.asEuint32(2); // Default to medium risk
        
        riskAssessments[policyholder] = RiskAssessment({
            riskScore: encryptedRiskScore,
            riskLevel: riskLevel,
            isVerified: true,
            assessmentHash: assessmentHash,
            assessor: msg.sender,
            assessmentDate: block.timestamp
        });
        
        // Set ACL permissions for risk assessment data
        FHE.allowThis(riskAssessments[policyholder].riskScore);
        FHE.allowThis(riskAssessments[policyholder].riskLevel);
        FHE.allow(riskAssessments[policyholder].riskScore, policyholder);
        FHE.allow(riskAssessments[policyholder].riskLevel, policyholder);
        
        emit RiskAssessed(policyholder, 0, true); // riskScore will be decrypted off-chain
    }
    
    function updateReputation(address user, externalEuint32 reputation, bytes calldata inputProof) public {
        require(msg.sender == verifier, "Only verifier can update reputation");
        require(user != address(0), "Invalid user address");
        
        // Convert external encrypted reputation to internal FHE type
        euint32 encryptedReputation = FHE.fromExternal(reputation, inputProof);
        
        // Determine if user is policyholder or insurer based on context
        if (policies[policyCounter - 1].policyholder == user) {
            policyholderReputation[user] = encryptedReputation;
            FHE.allowThis(policyholderReputation[user]);
            FHE.allow(policyholderReputation[user], user);
        } else {
            insurerReputation[user] = encryptedReputation;
            FHE.allowThis(insurerReputation[user]);
            FHE.allow(insurerReputation[user], user);
        }
        
        emit ReputationUpdated(user, 0); // reputation will be decrypted off-chain
    }
    
    function verifyPolicy(uint256 policyId, bool isVerified) public {
        require(msg.sender == verifier, "Only verifier can verify policies");
        require(policies[policyId].policyholder != address(0), "Policy does not exist");
        
        policies[policyId].isVerified = isVerified;
    }
    
    function getPolicyInfo(uint256 policyId) public view returns (
        string memory policyType,
        string memory description,
        euint32 premiumAmount,
        euint32 coverageAmount,
        euint32 claimCount,
        bool isActive,
        bool isVerified,
        address policyholder,
        address insurer,
        uint256 startDate,
        uint256 endDate
    ) {
        Policy storage policy = policies[policyId];
        return (
            policy.policyType,
            policy.description,
            policy.premiumAmount,
            policy.coverageAmount,
            policy.claimCount,
            policy.isActive,
            policy.isVerified,
            policy.policyholder,
            policy.insurer,
            policy.startDate,
            policy.endDate
        );
    }
    
    function getClaimInfo(uint256 claimId) public view returns (
        euint32 claimAmount,
        euint32 policyId,
        bool isApproved,
        bool isProcessed,
        string memory claimType,
        string memory description,
        string memory evidenceHash,
        address claimant,
        address claimAdjuster,
        uint256 submissionDate,
        uint256 processingDate
    ) {
        Claim storage claim = claims[claimId];
        return (
            claim.claimAmount,
            claim.policyId,
            claim.isApproved,
            claim.isProcessed,
            claim.claimType,
            claim.description,
            claim.evidenceHash,
            claim.claimant,
            claim.adjuster,
            claim.submissionDate,
            claim.processingDate
        );
    }
    
    function getSettlementInfo(uint256 settlementId) public view returns (
        euint32 claimId,
        euint32 settlementAmount,
        bool isCompleted,
        string memory settlementHash,
        address beneficiary,
        uint256 settlementDate
    ) {
        Settlement storage settlement = settlements[settlementId];
        return (
            settlement.claimId,
            settlement.settlementAmount,
            settlement.isCompleted,
            settlement.settlementHash,
            settlement.beneficiary,
            settlement.settlementDate
        );
    }
    
    function getRiskAssessment(address policyholder) public view returns (
        euint32 riskScore,
        euint32 riskLevel,
        bool isVerified,
        string memory assessmentHash,
        address assessor,
        uint256 assessmentDate
    ) {
        RiskAssessment storage assessment = riskAssessments[policyholder];
        return (
            assessment.riskScore,
            assessment.riskLevel,
            assessment.isVerified,
            assessment.assessmentHash,
            assessment.assessor,
            assessment.assessmentDate
        );
    }
    
    function getPolicyholderReputation(address policyholder) public view returns (euint32) {
        return policyholderReputation[policyholder];
    }
    
    function getInsurerReputation(address insurer) public view returns (euint32) {
        return insurerReputation[insurer];
    }
    
    function payPremium(uint256 policyId) public payable {
        require(policies[policyId].policyholder == msg.sender, "Only policyholder can pay premium");
        require(policies[policyId].isActive, "Policy must be active");
        require(msg.value > 0, "Premium amount must be positive");
        
        // In a real implementation, premium would be stored and managed
        // For now, we'll just accept the payment
    }
    
    function withdrawSettlement(uint256 settlementId) public {
        require(settlements[settlementId].beneficiary == msg.sender, "Only beneficiary can withdraw");
        require(settlements[settlementId].isCompleted, "Settlement must be completed");
        
        // Transfer settlement amount to beneficiary
        // Note: In a real implementation, funds would be transferred based on decrypted amount
        settlements[settlementId].isCompleted = true;
        
        // For now, we'll transfer a placeholder amount
        // payable(msg.sender).transfer(amount);
    }
    
    // ============ SIMPLE POLICY FUNCTIONS FOR DEMO ============
    
    /**
     * @notice Create a simple policy for demo purposes (without FHE encryption)
     * @param _policyType Type of policy
     * @param _description Policy description
     * @param _premiumAmount Premium amount
     * @param _coverageAmount Coverage amount
     * @param _duration Policy duration in seconds
     */
    function createSimplePolicy(
        string memory _policyType,
        string memory _description,
        uint256 _premiumAmount,
        uint256 _coverageAmount,
        uint256 _duration
    ) public returns (uint256) {
        require(bytes(_policyType).length > 0, "Policy type cannot be empty");
        require(_duration > 0, "Duration must be positive");
        require(_premiumAmount > 0, "Premium amount must be positive");
        require(_coverageAmount > 0, "Coverage amount must be positive");
        
        uint256 policyId = policyCounter++;
        
        policies[policyId] = Policy({
            policyId: FHE.asEuint32(uint32(policyId)),
            premiumAmount: FHE.asEuint32(uint32(_premiumAmount)),
            coverageAmount: FHE.asEuint32(uint32(_coverageAmount)),
            claimLimit: FHE.asEuint32(uint32(10)), // Default claim limit
            claimCount: FHE.asEuint32(uint32(0)), // Start with 0 claims
            isActive: true,
            isVerified: true,
            policyType: _policyType,
            description: _description,
            policyholder: msg.sender,
            insurer: address(this), // Contract as insurer for demo
            startDate: block.timestamp,
            endDate: block.timestamp + _duration
        });
        
        // Set ACL permissions for encrypted data
        FHE.allowThis(policies[policyId].premiumAmount);
        FHE.allow(policies[policyId].premiumAmount, msg.sender);
        FHE.allowThis(policies[policyId].coverageAmount);
        FHE.allow(policies[policyId].coverageAmount, msg.sender);
        
        emit PolicyCreated(policyId, msg.sender, _policyType);
        return policyId;
    }
    
    /**
     * @notice Create a policy for a specific user (admin function)
     * @param _policyholder Address of the policyholder
     * @param _policyType Type of policy
     * @param _description Policy description
     * @param _premiumAmount Premium amount
     * @param _coverageAmount Coverage amount
     * @param _duration Policy duration in seconds
     */
    function createPolicyForUser(
        address _policyholder,
        string memory _policyType,
        string memory _description,
        uint256 _premiumAmount,
        uint256 _coverageAmount,
        uint256 _duration
    ) public returns (uint256) {
        require(bytes(_policyType).length > 0, "Policy type cannot be empty");
        require(_duration > 0, "Duration must be positive");
        require(_premiumAmount > 0, "Premium amount must be positive");
        require(_coverageAmount > 0, "Coverage amount must be positive");
        require(_policyholder != address(0), "Invalid policyholder address");
        
        uint256 policyId = policyCounter++;
        
        policies[policyId] = Policy({
            policyId: FHE.asEuint32(uint32(policyId)),
            premiumAmount: FHE.asEuint32(uint32(_premiumAmount)),
            coverageAmount: FHE.asEuint32(uint32(_coverageAmount)),
            claimLimit: FHE.asEuint32(uint32(10)), // Default claim limit
            claimCount: FHE.asEuint32(uint32(0)), // Start with 0 claims
            isActive: true,
            isVerified: true,
            policyType: _policyType,
            description: _description,
            policyholder: _policyholder,
            insurer: address(this), // Contract as insurer for demo
            startDate: block.timestamp,
            endDate: block.timestamp + _duration
        });
        
        // Set ACL permissions for encrypted data
        FHE.allowThis(policies[policyId].premiumAmount);
        FHE.allow(policies[policyId].premiumAmount, _policyholder);
        FHE.allowThis(policies[policyId].coverageAmount);
        FHE.allow(policies[policyId].coverageAmount, _policyholder);
        
        emit PolicyCreated(policyId, _policyholder, _policyType);
        return policyId;
    }
    
    // ============ SIMPLE CLAIM FUNCTIONS FOR DEMO ============
    
    /**
     * @notice Submit an encrypted claim with FHE protection
     * @param claimTypeEncrypted FHE encrypted claim type (as uint8)
     * @param claimAmountEncrypted FHE encrypted claim amount
     * @param policyNumberEncrypted FHE encrypted policy number
     * @param contactInfoEncrypted FHE encrypted contact information
     * @param descriptionEncrypted FHE encrypted description
     * @param inputProof Proof for all encrypted inputs
     */
    function submitSimpleClaim(
        externalEuint8 claimTypeEncrypted,
        externalEuint32 claimAmountEncrypted,
        externalEuint32 policyNumberEncrypted,
        externalEuint32 contactInfoEncrypted,
        externalEuint32 descriptionEncrypted,
        bytes calldata inputProof
    ) public returns (uint256) {
        uint256 claimId = simpleClaimCounter++;
        
        // Convert external encrypted inputs to internal FHE types
        euint8 claimType = FHE.fromExternal(claimTypeEncrypted, inputProof);
        euint32 claimAmount = FHE.fromExternal(claimAmountEncrypted, inputProof);
        euint32 policyNumber = FHE.fromExternal(policyNumberEncrypted, inputProof);
        euint32 contactInfo = FHE.fromExternal(contactInfoEncrypted, inputProof);
        euint32 description = FHE.fromExternal(descriptionEncrypted, inputProof);
        
        // Create encrypted claim
        simpleClaims[claimId] = SimpleClaim({
            claimId: claimId,
            encryptedClaimType: claimType,
            encryptedAmount: claimAmount,
            encryptedPolicyNumber: policyNumber,
            encryptedContactInfo: contactInfo,
            encryptedDescription: description,
            claimant: msg.sender,
            submissionDate: block.timestamp,
            isActive: true
        });
        
        // Add to user's claim list
        userClaims[msg.sender].push(claimId);
        
        // Set ACL permissions for encrypted data
        FHE.allowThis(simpleClaims[claimId].encryptedAmount);
        FHE.allow(simpleClaims[claimId].encryptedAmount, msg.sender);
        FHE.allowThis(simpleClaims[claimId].encryptedClaimType);
        FHE.allow(simpleClaims[claimId].encryptedClaimType, msg.sender);
        FHE.allowThis(simpleClaims[claimId].encryptedPolicyNumber);
        FHE.allow(simpleClaims[claimId].encryptedPolicyNumber, msg.sender);
        FHE.allowThis(simpleClaims[claimId].encryptedContactInfo);
        FHE.allow(simpleClaims[claimId].encryptedContactInfo, msg.sender);
        FHE.allowThis(simpleClaims[claimId].encryptedDescription);
        FHE.allow(simpleClaims[claimId].encryptedDescription, msg.sender);
        
        emit SimpleClaimSubmitted(claimId, msg.sender, "encrypted");
        return claimId;
    }
    
    /**
     * @notice Get user's claim IDs
     * @param user User address
     * @return Array of claim IDs
     */
    function getUserClaims(address user) public view returns (uint256[] memory) {
        return userClaims[user];
    }
    
    /**
     * @notice Get simple claim details (without encrypted data)
     * @param claimId Claim ID
     * @return claimId, claimant, submissionDate, isActive
     */
    function getSimpleClaimInfo(uint256 claimId) public view returns (
        uint256,
        address,
        uint256,
        bool
    ) {
        SimpleClaim storage claim = simpleClaims[claimId];
        return (
            claim.claimId,
            claim.claimant,
            claim.submissionDate,
            claim.isActive
        );
    }
    
    /**
     * @notice Get encrypted amount for a claim (for decryption)
     * @param claimId Claim ID
     * @return Encrypted amount as euint32
     */
    function getClaimEncryptedAmount(uint256 claimId) public view returns (euint32) {
        require(simpleClaims[claimId].claimant != address(0), "Claim does not exist");
        require(simpleClaims[claimId].claimant == msg.sender, "Only claimant can access encrypted data");
        return simpleClaims[claimId].encryptedAmount;
    }
    
    /**
     * @notice Get all encrypted claim data for decryption
     * @param claimId Claim ID
     * @return claimType, amount, policyNumber, contactInfo, description
     */
    function getClaimEncryptedData(uint256 claimId) public view returns (
        euint8,
        euint32,
        euint32,
        euint32,
        euint32
    ) {
        require(simpleClaims[claimId].claimant != address(0), "Claim does not exist");
        require(simpleClaims[claimId].claimant == msg.sender, "Only claimant can access encrypted data");
        SimpleClaim storage claim = simpleClaims[claimId];
        return (
            claim.encryptedClaimType,
            claim.encryptedAmount,
            claim.encryptedPolicyNumber,
            claim.encryptedContactInfo,
            claim.encryptedDescription
        );
    }
    
    /**
     * @notice Mark claim as decrypted (for demo purposes)
     * @param claimId Claim ID
     */
    function markClaimAsDecrypted(uint256 claimId) public {
        require(simpleClaims[claimId].claimant == msg.sender, "Only claimant can mark as decrypted");
        require(simpleClaims[claimId].isActive, "Claim is not active");
        
        emit ClaimDecrypted(claimId, msg.sender);
    }
    
    /**
     * @notice Get total number of simple claims
     * @return Total number of claims
     */
    function getTotalSimpleClaims() public view returns (uint256) {
        return simpleClaimCounter;
    }
}