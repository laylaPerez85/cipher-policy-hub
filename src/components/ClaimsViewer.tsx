import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Lock, Eye, FileText, TrendingUp, AlertCircle, RefreshCw, Unlock, EyeOff } from "lucide-react";
import { useAccount } from "wagmi";
import { useReadContract } from "wagmi";
import { CipherPolicyHubABI, CONTRACT_ADDRESS } from "@/lib/contract";
import { useDecryptClaim } from "@/hooks/useDecryptClaim";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { useToast } from "@/hooks/use-toast";
import { ErrorHandler } from "@/utils/errorHandler";

const ClaimsViewer = () => {
  const { address } = useAccount();
  const { isWalletReady, connectionError } = useWalletConnection();
  const [claims, setClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [decrypting, setDecrypting] = useState<string | null>(null);
  const [decryptedData, setDecryptedData] = useState<Record<string, any>>({});
  const { toast } = useToast();
  const { decryptClaim } = useDecryptClaim();

  // 获取合约统计信息 - 使用可用的函数
  const { data: contractStats } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CipherPolicyHubABI,
    functionName: 'getTotalSimpleClaims',
  });

  // 获取总理赔数量
  const { data: totalClaims } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CipherPolicyHubABI,
    functionName: 'getTotalSimpleClaims',
  });

  useEffect(() => {
    // 改进的合约调用，增加错误处理和重试机制
    const testContract = async () => {
      if (!address || !isWalletReady) {
        console.log('Wallet not ready or address not available');
        return;
      }
      
      try {
        console.log('Testing contract calls...');
        console.log('Contract address:', CONTRACT_ADDRESS);
        console.log('User address:', address);
        console.log('Wallet ready:', isWalletReady);
        
        // 测试 getUserClaims - 使用更稳定的方法
        const { ethers } = await import('ethers');
        const provider = new ethers.BrowserProvider(window.ethereum);
        
        // 等待 provider 准备就绪
        await provider.ready;
        
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CipherPolicyHubABI, provider);
        
        console.log('Calling getUserClaims...');
        const userClaims = await contract.getUserClaims(address);
        console.log('getUserClaims result:', userClaims);
        console.log('getUserClaims length:', userClaims.length);
        
        // 测试 getTotalSimpleClaims
        const totalClaims = await contract.getTotalSimpleClaims();
        console.log('getTotalSimpleClaims:', totalClaims.toString());
        
        if (userClaims && userClaims.length > 0) {
          console.log('Found claims:', userClaims.length);
          setClaims(userClaims.map((id: string, index: number) => ({
            id: id,
            user: address,
            timestamp: Date.now() / 1000,
            isActive: true,
          })));
        } else {
          console.log('No claims found');
          setClaims([]);
        }
      } catch (error) {
        ErrorHandler.logError('Contract test', error);
        
        // 使用改进的错误处理
        const errorMessage = ErrorHandler.handleWalletError(error);
        console.error('Contract test failed:', errorMessage);
        
        setClaims([]);
      }
    };
    
    // 只有在钱包准备就绪时才执行
    if (isWalletReady) {
      const timeoutId = setTimeout(testContract, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [address, isWalletReady]);

  const handleRefresh = async () => {
    setLoading(true);
    // 简单刷新
    window.location.reload();
    setLoading(false);
  };

  const handleDecrypt = async (claimId: string) => {
    if (!claimId) return;
    
    setDecrypting(claimId);
    try {
      const result = await decryptClaim(claimId);
      setDecryptedData(prev => ({
        ...prev,
        [claimId]: result
      }));
      
      toast({
        title: "Decryption Successful",
        description: "Claim data has been decrypted and is now viewable",
      });
    } catch (error) {
      console.error('Decryption failed:', error);
      toast({
        title: "Decryption Failed",
        description: error instanceof Error ? error.message : "An error occurred during decryption",
        variant: "destructive",
      });
    } finally {
      setDecrypting(null);
    }
  };

  const handleHideDecrypted = (claimId: string) => {
    setDecryptedData(prev => {
      const newData = { ...prev };
      delete newData[claimId];
      return newData;
    });
  };

  const metrics = [
    {
      title: "My Claims",
      value: claims.length.toString(),
      change: "submitted",
      icon: FileText,
      color: "text-primary",
    },
    {
      title: "Decrypted",
      value: Object.keys(decryptedData).length.toString(),
      change: "viewable",
      icon: Unlock,
      color: "text-green-500",
    },
    {
      title: "Encrypted",
      value: (claims.length - Object.keys(decryptedData).length).toString(),
      change: "locked",
      icon: Lock,
      color: "text-warning",
    },
    {
      title: "Total Claims",
      value: totalClaims ? totalClaims.toString() : "0",
      change: "all time",
      icon: TrendingUp,
      color: "text-accent",
    },
  ];

  // 显示连接错误
  if (connectionError) {
    return (
      <div className="space-y-6">
        <Card className="gradient-card border-red-500/50 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-500">
              <AlertCircle className="w-5 h-5" />
              <span>Connection Error</span>
            </CardTitle>
            <CardDescription>
              {connectionError}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Please ensure you have:
              </p>
              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                <li>MetaMask or compatible wallet installed</li>
                <li>Connected to Sepolia testnet</li>
                <li>Account unlocked and accessible</li>
              </ul>
              <Button 
                onClick={() => window.location.reload()} 
                className="mt-4"
                variant="outline"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry Connection
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={metric.title} className="gradient-card border-border/50 shadow-card transition-smooth hover:shadow-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{metric.value}</div>
              <p className={`text-xs ${metric.color}`}>
                {metric.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Claims Table */}
      <Card className="gradient-card border-border/50 shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-accent" />
                <span>My Claims</span>
              </CardTitle>
              <CardDescription>
                Claim data protected by FHE encryption, click to decrypt and view details
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center space-x-1"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </Button>
              <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                FHE Protected
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {claims.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Shield className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-lg font-medium mb-2">No Claim Data</p>
              <p className="text-sm">Submit your first claim to see it here</p>
            </div>
          ) : (
            claims.map((claim, index) => (
              <div
                key={claim.id || index}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50 transition-smooth hover:bg-muted/50"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">
                      {claim.id ? `Claim ${claim.id.slice(0, 8)}...` : `Claim #${index + 1}`}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {claim.user ? `${claim.user.slice(0, 6)}...${claim.user.slice(-4)}` : 'Unknown User'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(Number(claim.timestamp) * 1000).toLocaleString()}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-sm font-medium text-foreground">
                      {claim.isActive ? 'Active' : 'Inactive'}
                    </div>
                    <div className="text-xs text-muted-foreground">Status</div>
                  </div>
                  
                  <Badge 
                    variant={claim.isActive ? "secondary" : "outline"}
                    className="min-w-[80px]"
                  >
                    {claim.isActive ? "Active" : "Inactive"}
                  </Badge>
                  
                  <div className="flex items-center space-x-2">
                    {decryptedData[claim.id] ? (
                      <div className="flex items-center space-x-2">
                        <Unlock className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-green-500">Decrypted</span>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleHideDecrypted(claim.id)}
                          className="text-warning hover:text-warning-glow"
                        >
                          <EyeOff className="w-3 h-3 mr-1" />
                          Hide
                        </Button>
                        <div className="text-xs text-muted-foreground">
                          Amount: ${decryptedData[claim.id]?.claimAmount || 'N/A'}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Lock className="w-4 h-4 text-warning" />
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDecrypt(claim.id)}
                          disabled={decrypting === claim.id}
                          className="text-primary hover:text-primary-glow"
                        >
                          {decrypting === claim.id ? (
                            <>
                              <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                              Decrypting...
                            </>
                          ) : (
                            "Decrypt & View"
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Decrypted Data Display */}
      {Object.keys(decryptedData).length > 0 && (
        <Card className="gradient-card border-border/50 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="w-5 h-5 text-green-500" />
              <span>Decrypted Claim Details</span>
            </CardTitle>
            <CardDescription>
              Sensitive data that has been decrypted for viewing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(decryptedData).map(([claimId, data]) => (
              <div key={claimId} className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-green-800 dark:text-green-200">
                    Claim {claimId.slice(0, 8)}...
                  </h4>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleHideDecrypted(claimId)}
                    className="text-green-600 hover:text-green-700"
                  >
                    <EyeOff className="w-3 h-3 mr-1" />
                    Hide
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-muted-foreground">Claim Type:</span>
                    <span className="ml-2 capitalize">{data.claimType}</span>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Amount:</span>
                    <span className="ml-2">${data.claimAmount}</span>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Policy Number:</span>
                    <span className="ml-2">{data.policyNumber}</span>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Contact Info:</span>
                    <span className="ml-2">{data.contactInfo}</span>
                  </div>
                  <div className="md:col-span-2">
                    <span className="font-medium text-muted-foreground">Description:</span>
                    <p className="mt-1 text-muted-foreground">{data.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ClaimsViewer;