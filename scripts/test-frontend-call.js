import pkg from "hardhat";
const { ethers } = pkg;

async function testFrontendCall() {
  console.log("🧪 Testing frontend-style contract call...");
  
  try {
    // Simulate the exact same call that frontend makes
    const [deployer] = await ethers.getSigners();
    console.log("📋 Deployer:", deployer.address);
    
    // Use the same contract address as frontend
    const contractAddress = "0x7802254184B47Ee527da3F8348a18B393646A0ad";
    
    // Contract ABI for submitSimpleClaim (same as frontend)
    const contractABI = [
      {
        "inputs": [
          {"internalType": "externalEuint8", "name": "claimTypeEncrypted", "type": "bytes32"},
          {"internalType": "externalEuint32", "name": "claimAmountEncrypted", "type": "bytes32"},
          {"internalType": "externalEuint32", "name": "policyNumberEncrypted", "type": "bytes32"},
          {"internalType": "externalEuint32", "name": "contactInfoEncrypted", "type": "bytes32"},
          {"internalType": "externalEuint32", "name": "descriptionEncrypted", "type": "bytes32"},
          {"internalType": "bytes", "name": "inputProof", "type": "bytes"}
        ],
        "name": "submitSimpleClaim",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "policyCounter",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
      }
    ];
    
    const contract = new ethers.Contract(contractAddress, contractABI, deployer);
    
    // Check policy counter first
    console.log("🔍 Checking policy counter...");
    try {
      const policyCount = await contract.policyCounter();
      console.log("📊 Policy count:", policyCount.toString());
      
      if (policyCount.toString() === "0") {
        console.log("❌ No policies exist! Need to create a policy first.");
        console.log("💡 Try running: node scripts/init-policy.js");
        return;
      }
    } catch (error) {
      console.error("❌ Error checking policy counter:", error.message);
      return;
    }
    
    // Test with mock FHE data (same format as frontend)
    console.log("🔐 Testing with mock FHE data...");
    const mockHandles = [
      "0x9c8d1ca713da9ba1c5280f39f0efcf6fdab2a01f06000000000000aa36a70200", // claimType
      "0x11568b02be7a091850be72a9d1ca9f1a8d66442874010000000000aa36a70400", // claimAmount
      "0xc73e15357989600811c5aeb589735d924c6ca1f2f0020000000000aa36a70400", // policyNumber
      "0xf6743d2646d548cf0bd8085cc607f213ed556dfc5c030000000000aa36a70400", // contactInfo
      "0xb58f03b52c3ef37291baf9379b4e34ff5d4cdeb78b040000000000aa36a70400"  // description
    ];
    
    const mockProof = "0x05019c8d1ca713da9ba1c5280f39f0efcf6fdab2a01f06000000000000aa36a7020011568b02be7a091850be72a9d1ca9f1a8d66442874010000000000aa36a70400c73e15357989600811c5aeb589735d924c6ca1f2f0020000000000aa36a70400f6743d2646d548cf0bd8085cc607f213ed556dfc5c030000000000aa36a70400b58f03b52c3ef37291baf9379b4e34ff5d4cdeb78b040000000000aa36a70400";
    
    console.log("📤 Submitting mock claim...");
    const tx = await contract.submitSimpleClaim(
      mockHandles[0],
      mockHandles[1], 
      mockHandles[2],
      mockHandles[3],
      mockHandles[4],
      mockProof
    );
    
    console.log("⏳ Waiting for transaction confirmation...");
    const receipt = await tx.wait();
    
    console.log("✅ Mock claim submitted successfully!");
    console.log("📄 Transaction hash:", tx.hash);
    console.log("📄 Gas used:", receipt.gasUsed.toString());
    
  } catch (error) {
    console.error("❌ Test failed:", error);
    
    if (error.reason) {
      console.error("📋 Error reason:", error.reason);
    }
    if (error.code) {
      console.error("📋 Error code:", error.code);
    }
  }
}

testFrontendCall()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });
