import { useState } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import WalletConnect from "@/components/WalletConnect";
import ClaimsForm from "@/components/ClaimsForm";
import ClaimsStatus from "@/components/ClaimsStatus";
import ClaimsViewer from "@/components/ClaimsViewer";
import PolicyCreator from "@/components/PolicyCreator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [claims, setClaims] = useState<any[]>([]);

  const handleWalletConnected = (address: string) => {
    setWalletAddress(address);
  };

  const handleClaimSubmitted = (claim: any) => {
    setClaims(prev => [claim, ...prev]);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <DashboardHeader />
      
      <main className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Wallet Connection */}
          <div className="lg:col-span-1">
            <WalletConnect onWalletConnected={handleWalletConnected} />
          </div>
          
          {/* Main Content with Tabs */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="claims" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="claims">Submit Claim</TabsTrigger>
                <TabsTrigger value="policies">Create Policy</TabsTrigger>
                <TabsTrigger value="view">View Claims</TabsTrigger>
              </TabsList>
              
              <TabsContent value="claims" className="mt-6">
                <ClaimsForm 
                  walletAddress={walletAddress} 
                  onClaimSubmitted={handleClaimSubmitted} 
                />
              </TabsContent>
              
              <TabsContent value="policies" className="mt-6">
                <PolicyCreator />
              </TabsContent>
              
              <TabsContent value="view" className="mt-6">
                {walletAddress ? (
                  <ClaimsViewer />
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>View Claims</CardTitle>
                      <CardDescription>
                        Please connect your wallet to view your claims
                      </CardDescription>
                    </CardHeader>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        {/* Claims Status */}
        <div className="mt-12">
          <ClaimsStatus claims={claims} />
        </div>
      </main>
    </div>
  );
};

export default Index;
