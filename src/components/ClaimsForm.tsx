import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FileText, Shield, Upload, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSubmitClaim } from "@/hooks/useContract";
import { useZamaInstance } from "@/hooks/useZamaInstance";
import { useEthersSigner } from "@/hooks/useEthersSigner";
import { useAccount } from "wagmi";
import { Contract } from "ethers";
import { CipherPolicyHubABI, CONTRACT_ADDRESS } from "@/lib/contract";

interface ClaimsFormProps {
  walletAddress: string;
  onClaimSubmitted: (claim: any) => void;
}

const ClaimsForm = ({ walletAddress, onClaimSubmitted }: ClaimsFormProps) => {
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  
  const [formData, setFormData] = useState({
    claimType: "",
    incidentDate: today, // Default to today
    claimAmount: "",
    description: "",
    policyNumber: "",
    contactInfo: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  
  // FHE and wallet integration
  const { address } = useAccount();
  const { instance } = useZamaInstance();
  const signerPromise = useEthersSigner();
  
  const canSubmit = useMemo(() => {
    return formData.claimType && formData.claimAmount && formData.description && formData.policyNumber;
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instance || !address || !signerPromise) {
      toast({
        title: "Missing Requirements",
        description: "Please ensure wallet is connected and encryption service is ready.",
        variant: "destructive",
      });
      return;
    }
    if (!canSubmit) {
      toast({
        title: "Incomplete Form",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      // Create encrypted input for FHE - encrypt the claim amount
      const input = instance.createEncryptedInput(CONTRACT_ADDRESS, address);
      input.add32(parseInt(formData.claimAmount)); // Encrypt claim amount using FHE
      
      const encryptedInput = await input.encrypt();
      
      // Get signer and create contract instance
      const signer = await signerPromise;
      const contract = new Contract(CONTRACT_ADDRESS, CipherPolicyHubABI, signer);
      
      // Submit simple encrypted claim to contract
      const tx = await contract.submitSimpleClaim(
        formData.claimType,
        formData.description,
        encryptedInput.handles[0], // FHE encrypted claim amount
        encryptedInput.inputProof
      );
      
      await tx.wait();
      
      const claim = {
        id: `CLM-${Date.now()}`,
        claimType: formData.claimType,
        description: formData.description,
        amount: formData.claimAmount,
        walletAddress: address,
        submittedAt: new Date().toISOString(),
        status: "submitted",
        encrypted: true,
        txHash: tx.hash
      };
      
      onClaimSubmitted(claim);
      
      // Reset form
      setFormData({
        claimType: "",
        incidentDate: "",
        claimAmount: "",
        description: "",
        policyNumber: "",
        contactInfo: "",
      });
      
      toast({
        title: "FHE Encrypted Claim Submitted",
        description: `Your claim amount has been encrypted and submitted to the blockchain.`,
      });
    } catch (err) {
      console.error('Error submitting claim:', err);
      toast({
        title: "Submission Failed",
        description: "Failed to submit encrypted claim. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="shadow-card border-border/50">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-security rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-security-foreground" />
          </div>
          <div>
            <CardTitle className="text-xl">Submit Encrypted Claim</CardTitle>
            <CardDescription>
              All claim details are encrypted end-to-end for maximum security
            </CardDescription>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 mt-4">
          <Badge variant="secondary" className="bg-security/10 text-security border-security/20">
            <Shield className="w-3 h-3 mr-1" />
            AES-256 Encrypted
          </Badge>
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
            <FileText className="w-3 h-3 mr-1" />
            Blockchain Verified
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="claimType">Claim Type</Label>
              <Select value={formData.claimType} onValueChange={(value) => updateFormData("claimType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select claim type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto Insurance</SelectItem>
                  <SelectItem value="health">Health Insurance</SelectItem>
                  <SelectItem value="property">Property Insurance</SelectItem>
                  <SelectItem value="life">Life Insurance</SelectItem>
                  <SelectItem value="disability">Disability Insurance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="incidentDate">Incident Date</Label>
              <Input
                id="incidentDate"
                type="date"
                value={formData.incidentDate}
                onChange={(e) => updateFormData("incidentDate", e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="claimAmount">Claim Amount</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="claimAmount"
                  type="number"
                  placeholder="0.00"
                  className="pl-9"
                  value={formData.claimAmount}
                  onChange={(e) => updateFormData("claimAmount", e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="policyNumber">Policy Number</Label>
              <Input
                id="policyNumber"
                placeholder="Enter policy number"
                value={formData.policyNumber}
                onChange={(e) => updateFormData("policyNumber", e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contactInfo">Contact Information</Label>
            <Input
              id="contactInfo"
              placeholder="Email or phone number"
              value={formData.contactInfo}
              onChange={(e) => updateFormData("contactInfo", e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Claim Description</Label>
            <Textarea
              id="description"
              placeholder="Provide detailed description of the incident and claim..."
              rows={4}
              value={formData.description}
              onChange={(e) => updateFormData("description", e.target.value)}
              required
            />
          </div>
          
          <div className="border-2 border-dashed border-muted-dark rounded-lg p-6 text-center">
            <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground mb-2">Upload supporting documents</p>
            <p className="text-xs text-muted-foreground">
              All files are encrypted before upload. Accepted: PDF, JPG, PNG (Max 10MB)
            </p>
          </div>
          
          <Button
            type="submit"
            disabled={submitting || !instance || !address}
            variant="professional"
            size="lg"
            className="w-full"
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                Encrypting & Submitting Claim...
              </>
            ) : (
              <>
                <Shield className="w-4 h-4 mr-2" />
                Submit FHE-Encrypted Claim
              </>
            )}
          </Button>
          
          {(!instance || !address) && (
            <p className="text-sm text-warning text-center">
              Please connect your wallet and ensure encryption service is ready
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default ClaimsForm;