import { useContract, useContractWrite, useContractRead } from 'wagmi';
import { CipherPolicyHubABI } from '../lib/contract';

const CONTRACT_ADDRESS = '0x...'; // Contract address after deployment

export const useCipherPolicyHub = () => {
  const contract = useContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CipherPolicyHubABI,
  });

  return contract;
};

export const useCreatePolicy = () => {
  const { write, isLoading, error } = useContractWrite({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CipherPolicyHubABI,
    functionName: 'createPolicy',
  });

  return { createPolicy: write, isLoading, error };
};

export const useSubmitClaim = () => {
  const { write, isLoading, error } = useContractWrite({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CipherPolicyHubABI,
    functionName: 'submitClaim',
  });

  return { submitClaim: write, isLoading, error };
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
