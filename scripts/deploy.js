const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying CipherPolicyHub contract...");

  // Get the contract factory
  const CipherPolicyHub = await ethers.getContractFactory("CipherPolicyHub");

  // Deploy the contract with verifier and adjuster addresses
  // In production, these should be actual addresses
  const verifier = "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"; // Example verifier address
  const adjuster = "0x8ba1f109551bD432803012645Hac136c"; // Example adjuster address

  console.log("📋 Contract parameters:");
  console.log("  Verifier:", verifier);
  console.log("  Adjuster:", adjuster);

  const cipherPolicyHub = await CipherPolicyHub.deploy(verifier, adjuster);

  await cipherPolicyHub.waitForDeployment();

  const contractAddress = await cipherPolicyHub.getAddress();
  console.log("✅ CipherPolicyHub deployed to:", contractAddress);

  // Update contract address in frontend
  const fs = require('fs');
  const path = require('path');
  
  const contractFilePath = path.join(__dirname, '../src/lib/contract.ts');
  let contractContent = fs.readFileSync(contractFilePath, 'utf8');
  
  // Replace the placeholder address
  contractContent = contractContent.replace(
    "export const CONTRACT_ADDRESS = '0x...'; // To be updated after deployment",
    `export const CONTRACT_ADDRESS = '${contractAddress}';`
  );
  
  fs.writeFileSync(contractFilePath, contractContent);
  console.log("📝 Updated contract address in frontend");

  // Create deployment info file
  const deploymentInfo = {
    contractAddress,
    verifier,
    adjuster,
    deploymentTime: new Date().toISOString(),
    network: "sepolia",
    abi: CipherPolicyHub.interface.format("json")
  };

  fs.writeFileSync(
    path.join(__dirname, '../deployment-info.json'),
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("📄 Deployment info saved to deployment-info.json");
  console.log("🎉 Deployment completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
