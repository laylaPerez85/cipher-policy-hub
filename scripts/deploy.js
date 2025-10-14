import pkg from "hardhat";
const { ethers } = pkg;
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log("🚀 Deploying CipherPolicyHub contract...");

  // Get the contract factory
  const CipherPolicyHub = await ethers.getContractFactory("CipherPolicyHub");

  // Get the deployer address to use as verifier and adjuster
  const [deployer] = await ethers.getSigners();
  const deployerAddress = await deployer.getAddress();
  
  // Use deployer address for both verifier and adjuster
  const verifier = deployerAddress;
  const adjuster = deployerAddress;

  console.log("📋 Contract parameters:");
  console.log("  Deployer:", deployerAddress);
  console.log("  Verifier:", verifier);
  console.log("  Adjuster:", adjuster);

  const cipherPolicyHub = await CipherPolicyHub.deploy(verifier, adjuster);

  await cipherPolicyHub.waitForDeployment();

  const contractAddress = await cipherPolicyHub.getAddress();
  console.log("✅ CipherPolicyHub deployed to:", contractAddress);

  // Update contract address in frontend
  
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
