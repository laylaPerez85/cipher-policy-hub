import { useState } from 'react';
import { useContractWrite, useContractRead, useWriteContract } from 'wagmi';
import { CipherPolicyHubABI, CONTRACT_ADDRESS } from '../lib/contract';
import { useZamaInstance } from './useZamaInstance';
import { useEthersSigner } from './useEthersSigner';
import { useAccount } from 'wagmi';
import { Contract } from 'ethers';

export const useCreatePolicy = () => {
  const { address } = useAccount();
  const { instance } = useZamaInstance();
  const signerPromise = useEthersSigner();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPolicy = async (policyData: {
    policyType: string;
    description: string;
    premiumAmount: number;
    coverageAmount: number;
    duration: number;
  }) => {
    if (!instance || !address || !signerPromise) {
      throw new Error('Missing wallet or encryption service');
    }

    setIsLoading(true);
    setError(null);

    try {
      // Create encrypted input for FHE
      const input = instance.createEncryptedInput(CONTRACT_ADDRESS, address);
      input.add32(policyData.premiumAmount);
      input.add32(policyData.coverageAmount);
      
      const encryptedInput = await input.encrypt();
      
      // Get signer and create contract instance
      const signer = await signerPromise;
      const contract = new Contract(CONTRACT_ADDRESS, CipherPolicyHubABI, signer);
      
      // Submit encrypted policy to contract
      const tx = await contract.createPolicy(
        policyData.policyType,
        policyData.description,
        encryptedInput.handles[0], // encrypted premium amount
        encryptedInput.handles[1], // encrypted coverage amount
        policyData.duration,
        encryptedInput.inputProof
      );
      
      await tx.wait();
      return tx.hash;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create policy';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { createPolicy, isLoading, error };
};

export const useSubmitClaim = () => {
  const { address } = useAccount();
  const { instance } = useZamaInstance();
  const signerPromise = useEthersSigner();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitClaim = async (claimData: {
    policyId: number;
    claimAmount: number;
    claimType: string;
    description: string;
    evidenceHash: string;
  }) => {
    if (!instance || !address || !signerPromise) {
      throw new Error('Missing wallet or encryption service');
    }

    setIsLoading(true);
    setError(null);

    try {
      // Create encrypted input for FHE
      const input = instance.createEncryptedInput(CONTRACT_ADDRESS, address);
      input.add32(claimData.claimAmount);
      
      const encryptedInput = await input.encrypt();
      
      // Get signer and create contract instance
      const signer = await signerPromise;
      const contract = new Contract(CONTRACT_ADDRESS, CipherPolicyHubABI, signer);
      
      // Submit encrypted claim to contract
      const tx = await contract.submitClaim(
        claimData.policyId,
        encryptedInput.handles[0], // encrypted claim amount
        claimData.claimType,
        claimData.description,
        claimData.evidenceHash,
        encryptedInput.inputProof
      );
      
      await tx.wait();
      return tx.hash;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit claim';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { submitClaim, isLoading, error };
};

export const useProcessClaim = () => {
  const { write, isLoading, error } = useContractWrite({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CipherPolicyHubABI,
    functionName: 'processClaim',
  });

  return { processClaim: write, isLoading, error };
};

export const useCompleteSettlement = () => {
  const { write, isLoading, error } = useContractWrite({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CipherPolicyHubABI,
    functionName: 'completeSettlement',
  });

  return { completeSettlement: write, isLoading, error };
};

export const usePayPremium = () => {
  const { write, isLoading, error } = useContractWrite({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CipherPolicyHubABI,
    functionName: 'payPremium',
  });

  return { payPremium: write, isLoading, error };
};

export const useGetPolicyInfo = (policyId: number) => {
  const { data, isLoading, error } = useContractRead({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CipherPolicyHubABI,
    functionName: 'getPolicyInfo',
    args: [BigInt(policyId)],
  });

  return { policyInfo: data, isLoading, error };
};

export const useGetClaimInfo = (claimId: number) => {
  const { data, isLoading, error } = useContractRead({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CipherPolicyHubABI,
    functionName: 'getClaimInfo',
    args: [BigInt(claimId)],
  });

  return { claimInfo: data, isLoading, error };
};

export const useGetSettlementInfo = (settlementId: number) => {
  const { data, isLoading, error } = useContractRead({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CipherPolicyHubABI,
    functionName: 'getSettlementInfo',
    args: [BigInt(settlementId)],
  });

  return { settlementInfo: data, isLoading, error };
};
