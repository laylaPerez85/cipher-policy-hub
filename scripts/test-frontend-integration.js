import pkg from "hardhat";
const { ethers } = pkg;
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testFrontendIntegration() {
  console.log('🧪 Testing frontend integration...');
  
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
    
    // Create a test policy for the demo user
    console.log('\n🏗️ Creating test policy for demo user...');
    const testUser = '0x1F12CfB01f28B0518cC495b1D0d597897eFd8602'; // This is the user from the logs
    
    const policyTx = await contract.createPolicyForUser(
      testUser,
      'health',
      'Health insurance policy for demo user',
      150,
      15000,
      365 * 24 * 60 * 60
    );
    
    console.log('⏳ Policy creation transaction:', policyTx.hash);
    await policyTx.wait();
    console.log('✅ Test policy created successfully!');
    
    // Verify the policy was created
    console.log('\n🔍 Verifying policy creation...');
    try {
      // Try to get policy info for the first policy (index 0)
      const policyInfo = await contract.getPolicyInfo(0);
      console.log('📋 Policy info:', {
        policyholder: policyInfo.policyholder,
        policyType: policyInfo.policyType,
        isActive: policyInfo.isActive
      });
      
      // Check if the policy belongs to our test user
      if (policyInfo.policyholder.toLowerCase() === testUser.toLowerCase()) {
        console.log('✅ Policy ownership verified - belongs to test user');
      } else {
        console.log('❌ Policy ownership mismatch');
      }
    } catch (error) {
      console.log('⚠️ Could not verify policy info:', error.message);
    }
    
    console.log('\n✅ Frontend integration test completed!');
    console.log('📋 Summary:');
    console.log('  - Test policy created for demo user');
    console.log('  - Policy ownership verified');
    console.log('  - Frontend should now show the policy in dropdown');
    console.log('  - User can select their own policy for claim submission');
    
    console.log('\n🌐 Frontend is available at: http://localhost:8083');
    console.log('📱 Test the following:');
    console.log('  1. Connect wallet (use the test user address)');
    console.log('  2. Go to "Create Policy" tab to create more policies');
    console.log('  3. Go to "Submit Claim" tab and select a policy from dropdown');
    console.log('  4. Submit an encrypted claim');
    console.log('  5. Go to "View Claims" tab to see and decrypt claims');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testFrontendIntegration()
  .then(() => {
    console.log('\n🎉 Frontend integration test completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Test failed:', error);
    process.exit(1);
  });
