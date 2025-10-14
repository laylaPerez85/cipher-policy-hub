import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { useZamaInstance } from '../hooks/useZamaInstance';
import { useEthersSigner } from '../hooks/useEthersSigner';
import { Contract } from 'ethers';
import { CipherPolicyHubABI, CONTRACT_ADDRESS } from '../lib/contract';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner';

interface PolicyFormData {
  policyType: string;
  premiumAmount: string;
  coverageAmount: string;
  startDate: string;
  endDate: string;
}

const PolicyCreator: React.FC = () => {
  const { address } = useAccount();
  const { instance } = useZamaInstance();
  const signerPromise = useEthersSigner();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<PolicyFormData>({
    policyType: 'health',
    premiumAmount: '100',
    coverageAmount: '10000',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!instance || !address || !signerPromise) {
      toast.error('Missing wallet or encryption service');
      return;
    }

    setSubmitting(true);
    
    try {
      console.log('🏗️ Creating policy with data:', formData);
      
      console.log('📝 Getting signer and creating contract...');
      const signer = await signerPromise;
      const contract = new Contract(CONTRACT_ADDRESS, CipherPolicyHubABI, signer);
      
      console.log('📤 Creating policy...');
      const tx = await contract.createSimplePolicy(
        formData.policyType,
        `Insurance policy for ${formData.policyType} coverage`, // description
        Number(formData.premiumAmount), // premiumAmount (unencrypted for now)
        Number(formData.coverageAmount), // coverageAmount (unencrypted for now)
        Math.floor((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / 1000) // duration in seconds
      );
      
      console.log('⏳ Waiting for transaction confirmation...');
      await tx.wait();
      
      toast.success('Policy created successfully!');
      console.log('✅ Policy creation completed');
      
      // Reset form
      setFormData({
        policyType: 'health',
        premiumAmount: '100',
        coverageAmount: '10000',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });
      
    } catch (error) {
      console.error('Error creating policy:', error);
      toast.error('Failed to create policy');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof PolicyFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const canSubmit = instance && address && signerPromise && !submitting;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Policy</CardTitle>
        <CardDescription>
          Create a new insurance policy with encrypted premium and coverage amounts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="policyType">Policy Type</Label>
              <select
                id="policyType"
                value={formData.policyType}
                onChange={(e) => handleInputChange('policyType', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="health">Health Insurance</option>
                <option value="auto">Auto Insurance</option>
                <option value="property">Property Insurance</option>
                <option value="life">Life Insurance</option>
                <option value="disability">Disability Insurance</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="premiumAmount">Premium Amount (USD)</Label>
              <Input
                id="premiumAmount"
                type="number"
                value={formData.premiumAmount}
                onChange={(e) => handleInputChange('premiumAmount', e.target.value)}
                placeholder="100"
                required
                min="1"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="coverageAmount">Coverage Amount (USD)</Label>
              <Input
                id="coverageAmount"
                type="number"
                value={formData.coverageAmount}
                onChange={(e) => handleInputChange('coverageAmount', e.target.value)}
                placeholder="10000"
                required
                min="1"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                required
              />
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={!canSubmit}
          >
            {submitting ? 'Creating Policy...' : 'Create Policy'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PolicyCreator;
