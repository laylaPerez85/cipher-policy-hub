import pkg from "hardhat";
const { ethers } = pkg;

async function testContractAccess() {
  console.log("🔍 Testing contract access...");
  
  try {
    // Test with a simple provider
    const provider = new ethers.JsonRpcProvider("https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161");
    const contractAddress = "0x7802254184B47Ee527da3F8348a18B393646A0ad";
    
    console.log("📋 Contract address:", contractAddress);
    console.log("🌐 Provider URL: https://1rpc.io/sepolia");
    
    // Check if contract exists by getting code
    const code = await provider.getCode(contractAddress);
    console.log("📄 Contract code length:", code.length);
    
    if (code === "0x") {
      console.log("❌ No contract found at this address");
      return;
    }
    
    console.log("✅ Contract exists at address");
    
    // Try to call a simple function
    const contractABI = [
      {
        "inputs": [],
        "name": "policyCounter",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
      }
    ];
    
    const contract = new ethers.Contract(contractAddress, contractABI, provider);
    
    try {
      const policyCount = await contract.policyCounter();
      console.log("📊 Policy count:", policyCount.toString());
    } catch (error) {
      console.error("❌ Error calling policyCounter:", error.message);
    }
    
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

testContractAccess()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });
