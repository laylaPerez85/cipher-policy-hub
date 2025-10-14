import { useState } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import WalletConnect from "@/components/WalletConnect";
import ClaimsForm from "@/components/ClaimsForm";
import ClaimsStatus from "@/components/ClaimsStatus";
import ClaimsViewer from "@/components/ClaimsViewer";

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
          
          {/* Claims Form */}
          <div className="lg:col-span-2">
            <ClaimsForm 
              walletAddress={walletAddress} 
              onClaimSubmitted={handleClaimSubmitted} 
            />
          </div>
        </div>
        
        {/* Claims Status */}
        <div className="mt-12">
          <ClaimsStatus claims={claims} />
        </div>
        
        {/* Claims Viewer - View and Decrypt Claims */}
        {walletAddress && (
          <div className="mt-12">
            <ClaimsViewer walletAddress={walletAddress} />
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
