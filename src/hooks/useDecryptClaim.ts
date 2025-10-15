import { useZamaInstance } from './useZamaInstance';
import { useEthersSigner } from './useEthersSigner';
import { useAccount } from 'wagmi';
import { Contract } from 'ethers';
import { CipherPolicyHubABI, CONTRACT_ADDRESS } from '@/lib/contract';

export const useDecryptClaim = () => {
  const { instance, isLoading: fheLoading, error: fheError } = useZamaInstance();
  const signerPromise = useEthersSigner();
  const { address } = useAccount();

  const decryptClaim = async (claimId: string) => {
    if (!instance || !address || !signerPromise) {
      throw new Error('Missing wallet or encryption service');
    }

    try {
      console.log('🔓 Starting decryption process for claim:', claimId);
      
      const signer = await signerPromise;
      const contract = new Contract(CONTRACT_ADDRESS, CipherPolicyHubABI, signer);
      
      // Get the claim details
      console.log('📋 Getting claim details...');
      const claimInfo = await contract.getSimpleClaimInfo(claimId);
      console.log('Claim details:', claimInfo);
      
      // Get encrypted claim data
      console.log('🔐 Getting encrypted claim data...');
      const encryptedData = await contract.getClaimEncryptedData(claimId);
      console.log('Encrypted data handles:', encryptedData);
      
      // Create keypair for decryption
      console.log('🔑 Generating keypair...');
      const keypair = instance.generateKeypair();
      
      // Prepare handles for decryption
      const handleContractPairs = [
        { handle: encryptedData.encryptedAmount, contractAddress: CONTRACT_ADDRESS },
        { handle: encryptedData.encryptedClaimType, contractAddress: CONTRACT_ADDRESS },
        { handle: encryptedData.encryptedPolicyNumber, contractAddress: CONTRACT_ADDRESS },
        { handle: encryptedData.encryptedContactInfo, contractAddress: CONTRACT_ADDRESS },
        { handle: encryptedData.encryptedDescription, contractAddress: CONTRACT_ADDRESS }
      ];
      
      const startTimeStamp = Math.floor(Date.now() / 1000).toString();
      const durationDays = "7";
      const contractAddresses = [CONTRACT_ADDRESS];
      
      console.log('📝 Creating EIP712 signature...');
      // Create EIP712 signature for decryption
      const eip712 = instance.createEIP712(keypair.publicKey, contractAddresses, startTimeStamp, durationDays);
      
      const signature = await signer.signTypedData(
        eip712.domain,
        {
          UserDecryptRequestVerification: eip712.types.UserDecryptRequestVerification,
        },
        eip712.message,
      );
      
      console.log('🔓 Decryption parameters:', {
        handleContractPairs,
        keypair: { publicKey: keypair.publicKey, privateKey: keypair.privateKey },
        signature: signature.replace("0x", ""),
        contractAddresses,
        userAddress: address,
        startTimeStamp,
        durationDays
      });
      
      // Decrypt all encrypted data
      console.log('🔓 Performing user decryption...');
      const result = await instance.userDecrypt(
        handleContractPairs,
        keypair.privateKey,
        keypair.publicKey,
        signature.replace("0x", ""),
        contractAddresses,
        address,
        startTimeStamp,
        durationDays,
      );
      
      console.log('✅ Decryption result:', result);
      
      // Convert claim type number back to string
      const claimTypeMap: { [key: number]: string } = {
        1: 'auto',
        2: 'health',
        3: 'property',
        4: 'life',
        5: 'disability'
      };
      
      const decryptedResult = {
        claimId: claimId,
        claimType: claimTypeMap[result[encryptedData.encryptedClaimType]] || 'unknown',
        claimAmount: result[encryptedData.encryptedAmount]?.toString() || '0',
        policyNumber: result[encryptedData.encryptedPolicyNumber]?.toString() || '0',
        contactInfo: result[encryptedData.encryptedContactInfo]?.toString() || '0',
        description: result[encryptedData.encryptedDescription]?.toString() || '0',
        claimant: claimInfo.claimant,
        submissionDate: claimInfo.submissionDate,
        isActive: claimInfo.isActive,
        encryptedData
      };
      
      console.log('🎉 Decryption completed successfully:', decryptedResult);
      return decryptedResult;
    } catch (err) {
      console.error('❌ FHE decryption failed:', err);
      console.error('Error details:', {
        name: err?.name,
        message: err?.message,
        stack: err?.stack,
        code: err?.code
      });
      throw err;
    }
  };

  return {
    decryptClaim,
    isLoading: fheLoading,
    error: fheError,
  };
};
