import pkg from "hardhat";
const { ethers } = pkg;
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testPolicyCreation() {
  console.log('🧪 Testing policy creation...');
  
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
    
    // Check current policy counter
    try {
      const policyCounter = await contract.policyCounter();
      console.log('📈 Current policy counter:', policyCounter.toString());
    } catch (error) {
      console.log('❌ Error getting policy counter:', error.message);
    }
    
    // Test creating a simple policy (without FHE encryption for testing)
    console.log('🏗️ Creating test policy...');
    
    // For testing, we'll use the createPolicyForUser function which doesn't require FHE
    const testUser = '0x135e82BABD74876BA78B372db4DC46922068804C';
    const policyType = 'health';
    const description = 'Health insurance policy for medical coverage';
    const premiumAmount = 100;
    const coverageAmount = 10000;
    const duration = 365 * 24 * 60 * 60; // 1 year in seconds
    
    console.log('📋 Policy details:', {
      user: testUser,
      type: policyType,
      description: description,
      premium: premiumAmount,
      coverage: coverageAmount,
      duration: duration
    });
    
    // Create policy for user
    const tx = await contract.createPolicyForUser(
      testUser,
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
    
    // Check updated policy counter
    const newPolicyCounter = await contract.policyCounter();
    console.log('📈 Updated policy counter:', newPolicyCounter.toString());
    
    // Get policy info
    const policyId = newPolicyCounter - 1;
    console.log('🔍 Getting policy info for ID:', policyId);
    
    try {
      const policyInfo = await contract.getPolicyInfo(policyId);
      console.log('📋 Policy info:', {
        policyholder: policyInfo.policyholder,
        policyType: policyInfo.policyType,
        isActive: policyInfo.isActive,
        startDate: new Date(Number(policyInfo.startDate) * 1000).toISOString(),
        endDate: new Date(Number(policyInfo.endDate) * 1000).toISOString()
      });
    } catch (error) {
      console.log('❌ Error getting policy info:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testPolicyCreation()
  .then(() => {
    console.log('✅ Test completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Test failed:', error);
    process.exit(1);
  });
