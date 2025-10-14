import pkg from "hardhat";
const { ethers } = pkg;

async function main() {
  console.log("🏥 Initializing medical policy for user...");
  
  // Get the contract
  const contractAddress = "0x57633c67c07ACaD0FDb8d2Bed0cc4c6B3578bE6A";
  const [deployer] = await ethers.getSigners();
  
  console.log("📋 Deployer address:", deployer.address);
  
  // Contract ABI for createPolicyForUser function
  const contractABI = [
    {
      "inputs": [
        {"internalType": "address", "name": "_policyholder", "type": "address"},
        {"internalType": "string", "name": "_policyType", "type": "string"},
        {"internalType": "string", "name": "_description", "type": "string"},
        {"internalType": "uint256", "name": "_premiumAmount", "type": "uint256"},
        {"internalType": "uint256", "name": "_coverageAmount", "type": "uint256"},
        {"internalType": "uint256", "name": "_duration", "type": "uint256"}
      ],
      "name": "createPolicyForUser",
      "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];
  
  const contract = new ethers.Contract(contractAddress, contractABI, deployer);
  
  // Create medical policy for the specified user
  const userAddress = "0x135e82BABD74876BA78B372db4DC46922068804C";
  console.log("📝 Creating medical policy for user:", userAddress);
  
  // Create policy for the specified user
  const tx = await contract.createPolicyForUser(
    userAddress, // _policyholder
    "Health Insurance", // _policyType
    "Comprehensive health coverage for medical expenses", // _description
    ethers.parseEther("0.1"), // _premiumAmount (0.1 ETH)
    ethers.parseEther("10"), // _coverageAmount (10 ETH)
    365 * 24 * 60 * 60 // _duration (1 year in seconds)
  );
  
  console.log("⏳ Waiting for transaction confirmation...");
  const receipt = await tx.wait();
  
  console.log("✅ Medical policy created successfully!");
  console.log("📄 Transaction hash:", tx.hash);
  console.log("📋 Policy ID: 0 (first policy)");
  console.log("👤 Policyholder: 0x135e82BABD74876BA78B372db4DC46922068804C");
  console.log("🏥 Policy Type: Health Insurance");
  console.log("💰 Premium: 0.1 ETH");
  console.log("🛡️ Coverage: 10 ETH");
  console.log("📅 Duration: 1 year");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Failed to initialize policy:", error);
    process.exit(1);
  });
