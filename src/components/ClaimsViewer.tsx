import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Shield, Lock, Unlock, Calendar, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useZamaInstance } from "@/hooks/useZamaInstance";
import { useEthersSigner } from "@/hooks/useEthersSigner";
import { useAccount } from "wagmi";
import { Contract } from "ethers";
import { CipherPolicyHubABI, CONTRACT_ADDRESS } from "@/lib/contract";

interface Claim {
  claimId: number;
  claimType: string;
  description: string;
  claimant: string;
  submissionDate: number;
  isActive: boolean;
  decryptedAmount?: number;
}

interface ClaimsViewerProps {
  walletAddress: string;
}

const ClaimsViewer = ({ walletAddress }: ClaimsViewerProps) => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(false);
  const [decrypting, setDecrypting] = useState<number | null>(null);
  const { toast } = useToast();
  
  // FHE and wallet integration
  const { address } = useAccount();
  const { instance } = useZamaInstance();
  const signerPromise = useEthersSigner();

  // Load user's claims from blockchain
  const loadClaims = async () => {
    if (!address || !signerPromise) return;
    
    setLoading(true);
    try {
      const signer = await signerPromise;
      const contract = new Contract(CONTRACT_ADDRESS, CipherPolicyHubABI, signer);
      
      // Get user's claim IDs
      const claimIds = await contract.getUserClaims(address);
      
      // Get details for each claim
      const claimsData = await Promise.all(
        claimIds.map(async (claimId: number) => {
          const claimInfo = await contract.getSimpleClaimInfo(claimId);
          return {
            claimId: claimInfo[0].toString(),
            claimType: claimInfo[1],
            description: claimInfo[2],
            claimant: claimInfo[3],
            submissionDate: Number(claimInfo[4]),
            isActive: claimInfo[5]
          };
        })
      );
      
      setClaims(claimsData);
    } catch (err) {
      console.error('Error loading claims:', err);
      toast({
        title: "Failed to Load Claims",
        description: "Could not load your claims from the blockchain.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Decrypt claim amount using FHE
  const decryptClaimAmount = async (claimId: number) => {
    if (!instance || !address || !signerPromise) {
      toast({
        title: "Missing Requirements",
        description: "Please ensure wallet is connected and encryption service is ready.",
        variant: "destructive",
      });
      return;
    }

    setDecrypting(claimId);
    try {
      const signer = await signerPromise;
      const contract = new Contract(CONTRACT_ADDRESS, CipherPolicyHubABI, signer);
      
      // Get encrypted amount from contract
      const encryptedAmount = await contract.getClaimEncryptedAmount(claimId);
      
      // Decrypt using FHE instance
      const decryptedAmount = await instance.userDecrypt(
        encryptedAmount,
        CONTRACT_ADDRESS,
        address
      );
      
      // Update claims with decrypted amount
      setClaims(prev => prev.map(claim => 
        claim.claimId === claimId 
          ? { ...claim, decryptedAmount: parseInt(decryptedAmount) }
          : claim
      ));
      
      // Mark as decrypted in contract
      await contract.markClaimAsDecrypted(claimId);
      
      toast({
        title: "Amount Decrypted",
        description: `Claim amount: $${decryptedAmount}`,
      });
    } catch (err) {
      console.error('Error decrypting claim:', err);
      toast({
        title: "Decryption Failed",
        description: "Could not decrypt the claim amount. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDecrypting(null);
    }
  };

  useEffect(() => {
    if (address) {
      loadClaims();
    }
  }, [address]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  return (
    <Card className="shadow-card border-border/50">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-security rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-security-foreground" />
          </div>
          <div>
            <CardTitle className="text-xl">My Encrypted Claims</CardTitle>
            <CardDescription>
              View and decrypt your FHE-encrypted claim data
            </CardDescription>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 mt-4">
          <Badge variant="secondary" className="bg-security/10 text-security border-security/20">
            <Shield className="w-3 h-3 mr-1" />
            FHE Encrypted
          </Badge>
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
            <FileText className="w-3 h-3 mr-1" />
            Blockchain Stored
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Loading claims...</span>
          </div>
        ) : claims.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No claims found</p>
            <p className="text-sm">Submit your first encrypted claim to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {claims.map((claim) => (
              <Card key={claim.claimId} className="border-border/30">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold">{claim.claimType}</h3>
                        <Badge variant={claim.isActive ? "default" : "secondary"}>
                          {claim.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        {claim.description}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(claim.submissionDate)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Shield className="w-3 h-3" />
                          <span>FHE Encrypted</span>
                        </div>
                      </div>
                      
                      {claim.decryptedAmount !== undefined ? (
                        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm">
                          <div className="flex items-center space-x-1 text-green-700">
                            <Unlock className="w-3 h-3" />
                            <span className="font-medium">Decrypted Amount: ${claim.decryptedAmount}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
                          <div className="flex items-center space-x-1 text-yellow-700">
                            <Lock className="w-3 h-3" />
                            <span>Amount is encrypted</span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="ml-4">
                      {claim.decryptedAmount === undefined ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => decryptClaimAmount(Number(claim.claimId))}
                          disabled={decrypting === Number(claim.claimId) || !instance}
                        >
                          {decrypting === Number(claim.claimId) ? (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary mr-1"></div>
                              Decrypting...
                            </>
                          ) : (
                            <>
                              <Eye className="w-3 h-3 mr-1" />
                              Decrypt Amount
                            </>
                          )}
                        </Button>
                      ) : (
                        <Badge variant="outline" className="text-green-600 border-green-200">
                          <Unlock className="w-3 h-3 mr-1" />
                          Decrypted
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        <div className="mt-4 pt-4 border-t border-border/30">
          <Button
            variant="outline"
            onClick={loadClaims}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Refreshing..." : "Refresh Claims"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClaimsViewer;
