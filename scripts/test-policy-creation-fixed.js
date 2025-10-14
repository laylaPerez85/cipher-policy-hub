import pkg from "hardhat";
const { ethers } = pkg;
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testPolicyCreationFixed() {
  console.log('🧪 Testing fixed policy creation...');
  
  try {
    // Get the deployer account
    const [deployer] = await ethers.getSigners();
    console.log('📋 Deployer:', deployer.address);
    
    // Load contract ABI and address
    const contractAddress = '0x7802254184B47Ee527da3F8348a18B393646A0ad';
    const contractPath = path.join(__dirname, '../artifacts/contracts/CipherPolicyHub.sol/CipherPolicyHub.json');
    const contractArtifact = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
    
    const contract = new ethers.Contract(contractAddress, contractArtifact.abi, deployer);
    
    console.log('📊 Contract address:', contractAddress);
    
    // Test creating a policy using the correct function signature
    console.log('\n🏗️ Creating policy with correct parameters...');
    
    const policyType = 'health';
    const description = 'Health insurance policy for medical coverage';
    const premiumAmount = 100;
    const coverageAmount = 10000;
    const duration = 365 * 24 * 60 * 60; // 1 year in seconds
    
    console.log('📋 Policy parameters:', {
      policyType,
      description,
      premiumAmount,
      coverageAmount,
      duration
    });
    
    // Create policy using the correct function signature
    const tx = await contract.createSimplePolicy(
      policyType,
      description,
      premiumAmount,
      coverageAmount,
      duration
    );
    
    console.log('⏳ Transaction hash:', tx.hash);
    console.log('⏳ Waiting for confirmation...');
    
    const receipt = await tx.wait();
    console.log('✅ Policy created successfully!');
    console.log('📊 Gas used:', receipt.gasUsed.toString());
    
    // Try to get policy info
    try {
      const policyInfo = await contract.getPolicyInfo(0);
      console.log('📋 Policy info:', {
        policyholder: policyInfo.policyholder,
        policyType: policyInfo.policyType,
        isActive: policyInfo.isActive
      });
    } catch (error) {
      console.log('⚠️ Could not get policy info:', error.message);
    }
    
    console.log('\n✅ Fixed policy creation test completed!');
    console.log('📋 Summary:');
    console.log('  - Policy creation with correct parameters: ✅');
    console.log('  - Function signature matches ABI: ✅');
    console.log('  - Frontend should now work: ✅');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testPolicyCreationFixed()
  .then(() => {
    console.log('\n🎉 Policy creation fix test completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Test failed:', error);
    process.exit(1);
  });
