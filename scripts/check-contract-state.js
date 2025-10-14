import pkg from "hardhat";
const { ethers } = pkg;

async function checkContractState() {
  console.log("🔍 Checking contract state...");
  
  try {
    const [deployer] = await ethers.getSigners();
    console.log("📋 Deployer:", deployer.address);
    
    // Contract address
    const contractAddress = "0x7802254184B47Ee527da3F8348a18B393646A0ad";
    
    // Contract ABI for basic functions
    const contractABI = [
      {
        "inputs": [],
        "name": "policyCounter",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getTotalSimpleClaims",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [{"internalType": "uint256", "name": "policyId", "type": "uint256"}],
        "name": "getPolicyInfo",
        "outputs": [
          {"internalType": "string", "name": "policyType", "type": "string"},
          {"internalType": "string", "name": "description", "type": "string"},
          {"internalType": "bool", "name": "isActive", "type": "bool"},
          {"internalType": "bool", "name": "isVerified", "type": "bool"},
          {"internalType": "address", "name": "policyholder", "type": "address"},
          {"internalType": "address", "name": "insurer", "type": "address"},
          {"internalType": "uint256", "name": "startDate", "type": "uint256"},
          {"internalType": "uint256", "name": "endDate", "type": "uint256"}
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ];
    
    const contract = new ethers.Contract(contractAddress, contractABI, deployer);
    
    // Check policy counter
    const policyCount = await contract.policyCounter();
    console.log("📊 Policy count:", policyCount.toString());
    
    // Check claim counter
    const claimCount = await contract.getTotalSimpleClaims();
    console.log("📊 Claim count:", claimCount.toString());
    
    // Check policy details if exists
    if (policyCount.toString() !== "0") {
      console.log("📋 Checking policy details...");
      try {
        const policyInfo = await contract.getPolicyInfo(0);
        console.log("📄 Policy 0 details:");
        console.log("  - Type:", policyInfo.policyType);
        console.log("  - Description:", policyInfo.description);
        console.log("  - Active:", policyInfo.isActive);
        console.log("  - Verified:", policyInfo.isVerified);
        console.log("  - Policyholder:", policyInfo.policyholder);
        console.log("  - Insurer:", policyInfo.insurer);
        console.log("  - Start Date:", new Date(Number(policyInfo.startDate) * 1000).toLocaleString());
        console.log("  - End Date:", new Date(Number(policyInfo.endDate) * 1000).toLocaleString());
      } catch (error) {
        console.error("❌ Error getting policy info:", error.message);
      }
    }
    
    console.log("✅ Contract state check completed!");
    
  } catch (error) {
    console.error("❌ Check failed:", error);
  }
}

checkContractState()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });
