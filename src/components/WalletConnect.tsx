import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, CheckCircle, AlertCircle, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect } from 'wagmi';

interface WalletConnectProps {
  onWalletConnected: (address: string) => void;
}

const WalletConnect = ({ onWalletConnected }: WalletConnectProps) => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { toast } = useToast();

  useEffect(() => {
    if (isConnected && address) {
      onWalletConnected(address);
      toast({
        title: "Wallet Connected",
        description: "Your wallet has been successfully connected to the claims system.",
      });
    } else {
      onWalletConnected("");
    }
  }, [isConnected, address, onWalletConnected, toast]);

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard.",
      });
    }
  };

  const handleDisconnect = () => {
    disconnect();
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected from the system.",
    });
  };

  return (
    <Card className="shadow-card border-border/50">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
          <Wallet className="w-6 h-6 text-primary-foreground" />
        </div>
        <CardTitle className="text-xl font-semibold">Wallet Connection</CardTitle>
        <CardDescription>
          Connect your wallet to securely submit and track insurance claims
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!isConnected ? (
          <div className="flex justify-center">
            <ConnectButton />
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-center p-3 bg-success/10 border border-success/20 rounded-lg">
              <CheckCircle className="w-5 h-5 text-success mr-2" />
              <span className="text-success font-medium">Wallet Connected</span>
            </div>
            
            <div className="bg-muted p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Address:</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={copyAddress}
                  className="h-6 px-2"
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
              <p className="font-mono text-sm mt-1 break-all">
                {address}
              </p>
            </div>
            
            <Button 
              onClick={handleDisconnect}
              variant="outline"
              size="sm"
              className="w-full"
            >
              Disconnect Wallet
            </Button>
          </div>
        )}
        
        <div className="text-xs text-muted-foreground text-center mt-4">
          <AlertCircle className="w-4 h-4 inline mr-1" />
          Your wallet address is used for claim verification and settlement processing
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletConnect;