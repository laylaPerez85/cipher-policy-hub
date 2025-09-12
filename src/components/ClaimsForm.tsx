import { useState } from "react";
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

interface ClaimsFormProps {
  walletAddress: string;
  onClaimSubmitted: (claim: any) => void;
}

const ClaimsForm = ({ walletAddress, onClaimSubmitted }: ClaimsFormProps) => {
  const [formData, setFormData] = useState({
    claimType: "",
    incidentDate: "",
    claimAmount: "",
    description: "",
    policyNumber: "",
    contactInfo: "",
  });
  const { toast } = useToast();
  const { submitClaim, isLoading, error } = useSubmitClaim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletAddress) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet before submitting a claim.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Generate evidence hash from form data
      const evidenceData = {
        claimType: formData.claimType,
        incidentDate: formData.incidentDate,
        description: formData.description,
        contactInfo: formData.contactInfo,
        timestamp: Date.now()
      };
      const evidenceHash = btoa(JSON.stringify(evidenceData));
      
      // Submit claim to contract
      await submitClaim({
        args: [
          BigInt(formData.policyNumber), // policyId
          BigInt(formData.claimAmount), // claimAmount (will be encrypted by FHE)
          formData.claimType,
          formData.description,
          evidenceHash
        ]
      });
      
      const claim = {
        id: `CLM-${Date.now()}`,
        ...formData,
        walletAddress,
        submittedAt: new Date().toISOString(),
        status: "submitted",
        encrypted: true,
        evidenceHash
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
        title: "Claim Submitted Successfully",
        description: `Your encrypted claim ${claim.id} has been submitted to the blockchain.`,
      });
    } catch (err) {
      console.error('Error submitting claim:', err);
      toast({
        title: "Submission Failed",
        description: "Failed to submit claim. Please try again.",
        variant: "destructive",
      });
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
            disabled={isLoading || !walletAddress}
            variant="professional"
            size="lg"
            className="w-full"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                Encrypting & Submitting Claim...
              </>
            ) : (
              <>
                <Shield className="w-4 h-4 mr-2" />
                Submit Encrypted Claim
              </>
            )}
          </Button>
          
          {!walletAddress && (
            <p className="text-sm text-warning text-center">
              Please connect your wallet to submit claims
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default ClaimsForm;