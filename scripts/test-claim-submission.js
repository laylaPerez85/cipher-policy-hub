import pkg from "hardhat";
const { ethers } = pkg;

// Mock FHE encryption for testing
function mockFHEEncryption() {
  // Simulate the FHE encryption process
  const handles = [
    "0xd4ef831bbadb3f2188751acec0f43e279c99fcd0d7000000000000aa36a70200", // claimType
    "0x9a21004c510d9dcbdb98b24bcfec21f24643bc8ead010000000000aa36a70400", // claimAmount
    "0xe98aca374d29413268af85651e0e1ef9e470661d6c020000000000aa36a70400", // policyNumber
    "0x1367eafa64e6e05c2bf68f88fcce80b5ac309f4d1e030000000000aa36a70400", // contactInfo
    "0xa940eb3d9ed7c5542d00c3c795958269f845e3c315040000000000aa36a70400"  // description
  ];
  
  const inputProof = "0x0501d4ef831bbadb3f2188751acec0f43e279c99fcd0d7000000000000aa36a702009a21004c510d9dcbdb98b24bcfec21f24643bc8ead010000000000aa36a70400e98aca374d29413268af85651e0e1ef9e470661d6c020000000000aa36a704001367eafa64e6e05c2bf68f88fcce80b5ac309f4d1e030000000000aa36a70400a940eb3d9ed7c5542d00c3c795958269f845e3c315040000000000aa36a7040041f33149924a4d7f61f1ac6b687f339834f2de6024c653a366bb5f642af69efc66f386713ced7de3ae49891fbfb7344e091a0dbf436fef5f9e0d27da1edc16491b00";
  
  return { handles, inputProof };
}

async function testClaimSubmission() {
  console.log("🧪 Testing claim submission with mock FHE encryption...");
  
  try {
    // Get signers
    const [deployer, user] = await ethers.getSigners();
    console.log("📋 Deployer:", deployer.address);
    console.log("👤 User:", user.address);
    
    // Contract address (use the latest deployed)
    const contractAddress = "0x7802254184B47Ee527da3F8348a18B393646A0ad";
    
    // Contract ABI for submitSimpleClaim
    const contractABI = [
      {
        "inputs": [
          {"internalType": "bytes", "name": "claimTypeEncrypted", "type": "bytes"},
          {"internalType": "bytes", "name": "claimAmountEncrypted", "type": "bytes"},
          {"internalType": "bytes", "name": "policyNumberEncrypted", "type": "bytes"},
          {"internalType": "bytes", "name": "contactInfoEncrypted", "type": "bytes"},
          {"internalType": "bytes", "name": "descriptionEncrypted", "type": "bytes"},
          {"internalType": "bytes", "name": "inputProof", "type": "bytes"}
        ],
        "name": "submitSimpleClaim",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "nonpayable",
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
        "inputs": [],
        "name": "policyCounter",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
      }
    ];
    
    const contract = new ethers.Contract(contractAddress, contractABI, user);
    
    // Check contract state
    console.log("🔍 Checking contract state...");
    const policyCount = await contract.policyCounter();
    const claimCount = await contract.getTotalSimpleClaims();
    console.log("📊 Policy count:", policyCount.toString());
    console.log("📊 Claim count:", claimCount.toString());
    
    if (policyCount.toString() === "0") {
      console.log("❌ No policies exist! Need to create a policy first.");
      return;
    }
    
    // Mock FHE encryption
    console.log("🔐 Mocking FHE encryption...");
    const { handles, inputProof } = mockFHEEncryption();
    
    console.log("📋 Encrypted handles:", handles);
    console.log("🔑 Input proof length:", inputProof.length);
    
    // Test claim submission
    console.log("📤 Submitting claim...");
    const tx = await contract.submitSimpleClaim(
      handles[0], // claimTypeEncrypted
      handles[1], // claimAmountEncrypted
      handles[2], // policyNumberEncrypted
      handles[3], // contactInfoEncrypted
      handles[4], // descriptionEncrypted
      inputProof  // inputProof
    );
    
    console.log("⏳ Waiting for transaction confirmation...");
    const receipt = await tx.wait();
    
    console.log("✅ Claim submitted successfully!");
    console.log("📄 Transaction hash:", tx.hash);
    console.log("📄 Gas used:", receipt.gasUsed.toString());
    
    // Check updated claim count
    const newClaimCount = await contract.getTotalSimpleClaims();
    console.log("📊 New claim count:", newClaimCount.toString());
    
  } catch (error) {
    console.error("❌ Test failed:", error);
    
    // Try to get more detailed error information
    if (error.data) {
      console.error("📋 Error data:", error.data);
    }
    if (error.reason) {
      console.error("📋 Error reason:", error.reason);
    }
    if (error.code) {
      console.error("📋 Error code:", error.code);
    }
  }
}

testClaimSubmission()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });
