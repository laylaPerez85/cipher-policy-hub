// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import { euint32, externalEuint32, euint8, ebool, FHE } from "@fhevm/solidity/lib/FHE.sol";

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
    
    uint256 public policyCounter;
    uint256 public claimCounter;
    uint256 public settlementCounter;
    
    address public owner;
    address public verifier;
    address public adjuster;
    
    event PolicyCreated(uint256 indexed policyId, address indexed policyholder, string policyType);
    event ClaimSubmitted(uint256 indexed claimId, uint256 indexed policyId, address indexed claimant);
    event ClaimProcessed(uint256 indexed claimId, bool isApproved, uint32 settlementAmount);
    event SettlementCompleted(uint256 indexed settlementId, uint256 indexed claimId, address indexed beneficiary);
    event RiskAssessed(address indexed policyholder, uint32 riskScore, bool isVerified);
    event ReputationUpdated(address indexed user, uint32 reputation);
    
    constructor(address _verifier, address _adjuster) {
        owner = msg.sender;
        verifier = _verifier;
        adjuster = _adjuster;
    }
    
    function createPolicy(
        string memory _policyType,
        string memory _description,
        uint256 _premiumAmount,
        uint256 _coverageAmount,
        uint256 _duration
    ) public returns (uint256) {
        require(bytes(_policyType).length > 0, "Policy type cannot be empty");
        require(_duration > 0, "Duration must be positive");
        require(_coverageAmount > _premiumAmount, "Coverage must exceed premium");
        
        uint256 policyId = policyCounter++;
        
        policies[policyId] = Policy({
            policyId: FHE.asEuint32(0), // Will be set properly later
            premiumAmount: FHE.asEuint32(0), // Will be set to actual value via FHE operations
            coverageAmount: FHE.asEuint32(0), // Will be set to actual value via FHE operations
            claimLimit: FHE.asEuint32(0), // Will be set to actual value via FHE operations
            claimCount: FHE.asEuint32(0),
            isActive: true,
            isVerified: false,
            policyType: _policyType,
            description: _description,
            policyholder: msg.sender,
            insurer: address(this), // Contract acts as insurer
            startDate: block.timestamp,
            endDate: block.timestamp + _duration
        });
        
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
        
        // Convert externalEuint32 to euint32 using FHE.fromExternal
        euint32 internalClaimAmount = FHE.fromExternal(claimAmount, inputProof);
        
        claims[claimId] = Claim({
            claimId: FHE.asEuint32(0), // Will be set properly later
            claimAmount: internalClaimAmount,
            policyId: FHE.asEuint32(0), // Will be set to actual value via FHE operations
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
        
        // Update policy claim count
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
            
            // Convert externalEuint32 to euint32 using FHE.fromExternal
            euint32 internalSettlementAmount = FHE.fromExternal(settlementAmount, inputProof);
            
            settlements[settlementId] = Settlement({
                settlementId: FHE.asEuint32(0), // Will be set properly later
                claimId: FHE.asEuint32(0), // Will be set to actual value via FHE operations
                settlementAmount: internalSettlementAmount,
                isCompleted: false,
                settlementHash: "",
                beneficiary: claims[claimId].claimant,
                settlementDate: 0
            });
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
        
        emit SettlementCompleted(settlementId, 0, settlements[settlementId].beneficiary); // claimId will be decrypted off-chain
    }
    
    function assessRisk(
        address policyholder,
        externalEuint32 riskScore,
        string memory assessmentHash,
        bytes calldata inputProof
    ) public {
        require(msg.sender == verifier, "Only verifier can assess risk");
        require(policyholder != address(0), "Invalid policyholder address");
        
        // Convert externalEuint32 to euint32 using FHE.fromExternal
        euint32 internalRiskScore = FHE.fromExternal(riskScore, inputProof);
        
        // Determine risk level based on score (0-100)
        ebool isHighRisk = FHE.gt(internalRiskScore, FHE.asEuint32(70));
        ebool isMediumRisk = FHE.and(
            FHE.gte(internalRiskScore, FHE.asEuint32(30)),
            FHE.lte(internalRiskScore, FHE.asEuint32(70))
        );
        ebool isLowRisk = FHE.lt(internalRiskScore, FHE.asEuint32(30));
        
        euint32 riskLevel = FHE.select(isHighRisk, FHE.asEuint32(3), 
            FHE.select(isMediumRisk, FHE.asEuint32(2), FHE.asEuint32(1)));
        
        riskAssessments[policyholder] = RiskAssessment({
            riskScore: internalRiskScore,
            riskLevel: riskLevel,
            isVerified: true,
            assessmentHash: assessmentHash,
            assessor: msg.sender,
            assessmentDate: block.timestamp
        });
        
        emit RiskAssessed(policyholder, 0, true); // riskScore will be decrypted off-chain
    }
    
    function updateReputation(address user, euint32 reputation) public {
        require(msg.sender == verifier, "Only verifier can update reputation");
        require(user != address(0), "Invalid user address");
        
        // Determine if user is policyholder or insurer based on context
        if (policies[policyCounter - 1].policyholder == user) {
            policyholderReputation[user] = reputation;
        } else {
            insurerReputation[user] = reputation;
        }
        
        emit ReputationUpdated(user, 0); // FHE.decrypt(reputation) - will be decrypted off-chain
    }
    
    function verifyPolicy(uint256 policyId, bool isVerified) public {
        require(msg.sender == verifier, "Only verifier can verify policies");
        require(policies[policyId].policyholder != address(0), "Policy does not exist");
        
        policies[policyId].isVerified = isVerified;
    }
    
    function getPolicyInfo(uint256 policyId) public view returns (
        string memory policyType,
        string memory description,
        uint8 premiumAmount,
        uint8 coverageAmount,
        uint8 claimCount,
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
            0, // FHE.decrypt(policy.premiumAmount) - will be decrypted off-chain
            0, // FHE.decrypt(policy.coverageAmount) - will be decrypted off-chain
            0, // FHE.decrypt(policy.claimCount) - will be decrypted off-chain
            policy.isActive,
            policy.isVerified,
            policy.policyholder,
            policy.insurer,
            policy.startDate,
            policy.endDate
        );
    }
    
    function getClaimInfo(uint256 claimId) public view returns (
        uint8 claimAmount,
        uint8 policyId,
        bool isApproved,
        bool isProcessed,
        string memory claimType,
        string memory description,
        string memory evidenceHash,
        address claimant,
        address adjuster,
        uint256 submissionDate,
        uint256 processingDate
    ) {
        Claim storage claim = claims[claimId];
        return (
            0, // FHE.decrypt(claim.claimAmount) - will be decrypted off-chain
            0, // FHE.decrypt(claim.policyId) - will be decrypted off-chain
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
        uint8 claimId,
        uint8 settlementAmount,
        bool isCompleted,
        string memory settlementHash,
        address beneficiary,
        uint256 settlementDate
    ) {
        Settlement storage settlement = settlements[settlementId];
        return (
            0, // FHE.decrypt(settlement.claimId) - will be decrypted off-chain
            0, // FHE.decrypt(settlement.settlementAmount) - will be decrypted off-chain
            settlement.isCompleted,
            settlement.settlementHash,
            settlement.beneficiary,
            settlement.settlementDate
        );
    }
    
    function getRiskAssessment(address policyholder) public view returns (
        uint8 riskScore,
        uint8 riskLevel,
        bool isVerified,
        string memory assessmentHash,
        address assessor,
        uint256 assessmentDate
    ) {
        RiskAssessment storage assessment = riskAssessments[policyholder];
        return (
            0, // FHE.decrypt(assessment.riskScore) - will be decrypted off-chain
            0, // FHE.decrypt(assessment.riskLevel) - will be decrypted off-chain
            assessment.isVerified,
            assessment.assessmentHash,
            assessment.assessor,
            assessment.assessmentDate
        );
    }
    
    function getPolicyholderReputation(address policyholder) public view returns (uint8) {
        return 0; // FHE.decrypt(policyholderReputation[policyholder]) - will be decrypted off-chain
    }
    
    function getInsurerReputation(address insurer) public view returns (uint8) {
        return 0; // FHE.decrypt(insurerReputation[insurer]) - will be decrypted off-chain
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
}
