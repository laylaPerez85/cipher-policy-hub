// Contract ABI for CipherPolicyHub with FHE support
export const CipherPolicyHubABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_verifier",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_adjuster",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "claimId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "isApproved",
        "type": "bool"
      },
      {
        "indexed": false,
        "internalType": "uint32",
        "name": "settlementAmount",
        "type": "uint32"
      }
    ],
    "name": "ClaimProcessed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "claimId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "policyId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "claimant",
        "type": "address"
      }
    ],
    "name": "ClaimSubmitted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "policyId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "policyholder",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "policyType",
        "type": "string"
      }
    ],
    "name": "PolicyCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "policyholder",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint32",
        "name": "riskScore",
        "type": "uint32"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "isVerified",
        "type": "bool"
      }
    ],
    "name": "RiskAssessed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "settlementId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "claimId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "beneficiary",
        "type": "address"
      }
    ],
    "name": "SettlementCompleted",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "policyholder",
        "type": "address"
      },
      {
        "internalType": "uint8",
        "name": "riskLevel",
        "type": "uint8"
      },
      {
        "internalType": "bool",
        "name": "isVerified",
        "type": "bool"
      },
      {
        "internalType": "string",
        "name": "assessmentHash",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "assessor",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "assessmentDate",
        "type": "uint256"
      }
    ],
    "name": "getRiskAssessment",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "riskScore",
        "type": "uint8"
      },
      {
        "internalType": "uint8",
        "name": "riskLevel",
        "type": "uint8"
      },
      {
        "internalType": "bool",
        "name": "isVerified",
        "type": "bool"
      },
      {
        "internalType": "string",
        "name": "assessmentHash",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "assessor",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "assessmentDate",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "policyId",
        "type": "uint256"
      }
    ],
    "name": "payPremium",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_policyType",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_description",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_premiumAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_coverageAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_duration",
        "type": "uint256"
      }
    ],
    "name": "createPolicy",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "claimId",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "isApproved",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "settlementAmount",
        "type": "uint256"
      }
    ],
    "name": "processClaim",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "policyId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "claimAmount",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "claimType",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "evidenceHash",
        "type": "string"
      }
    ],
    "name": "submitClaim",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "settlementId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "settlementHash",
        "type": "string"
      }
    ],
    "name": "completeSettlement",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "policyId",
        "type": "uint256"
      }
    ],
    "name": "getPolicyInfo",
    "outputs": [
      {
        "internalType": "string",
        "name": "policyType",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "uint8",
        "name": "premiumAmount",
        "type": "uint8"
      },
      {
        "internalType": "uint8",
        "name": "coverageAmount",
        "type": "uint8"
      },
      {
        "internalType": "uint8",
        "name": "claimCount",
        "type": "uint8"
      },
      {
        "internalType": "bool",
        "name": "isActive",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "isVerified",
        "type": "bool"
      },
      {
        "internalType": "address",
        "name": "policyholder",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "insurer",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "startDate",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "endDate",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "claimId",
        "type": "uint256"
      }
    ],
    "name": "getClaimInfo",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "claimAmount",
        "type": "uint8"
      },
      {
        "internalType": "uint8",
        "name": "policyId",
        "type": "uint8"
      },
      {
        "internalType": "bool",
        "name": "isApproved",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "isProcessed",
        "type": "bool"
      },
      {
        "internalType": "string",
        "name": "claimType",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "evidenceHash",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "claimant",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "adjuster",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "submissionDate",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "processingDate",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "settlementId",
        "type": "uint256"
      }
    ],
    "name": "getSettlementInfo",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "claimId",
        "type": "uint8"
      },
      {
        "internalType": "uint8",
        "name": "settlementAmount",
        "type": "uint8"
      },
      {
        "internalType": "bool",
        "name": "isCompleted",
        "type": "bool"
      },
      {
        "internalType": "string",
        "name": "settlementHash",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "beneficiary",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "settlementDate",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "claimType",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "encryptedAmount",
        "type": "uint256"
      }
    ],
    "name": "submitSimpleClaim",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "getUserClaims",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "claimId",
        "type": "uint256"
      }
    ],
    "name": "getSimpleClaimInfo",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "claimId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "claimType",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "claimant",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "submissionDate",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "isActive",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "claimId",
        "type": "uint256"
      }
    ],
    "name": "getClaimEncryptedAmount",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "claimId",
        "type": "uint256"
      }
    ],
    "name": "markClaimAsDecrypted",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTotalSimpleClaims",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

// Contract address - will be updated after deployment
export const CONTRACT_ADDRESS = '0x...'; // To be updated after deployment