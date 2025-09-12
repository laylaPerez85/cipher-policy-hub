import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Eye, 
  Download,
  Shield,
  DollarSign 
} from "lucide-react";

interface Claim {
  id: string;
  claimType: string;
  claimAmount: string;
  submittedAt: string;
  status: "submitted" | "processing" | "approved" | "rejected" | "settled";
  encrypted: boolean;
}

interface ClaimsStatusProps {
  claims: Claim[];
}

const ClaimsStatus = ({ claims }: ClaimsStatusProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "submitted":
        return <Clock className="w-4 h-4" />;
      case "processing":
        return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-warning"></div>;
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "rejected":
        return <AlertTriangle className="w-4 h-4" />;
      case "settled":
        return <DollarSign className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-muted text-muted-foreground";
      case "processing":
        return "bg-warning/10 text-warning border-warning/20";
      case "approved":
        return "bg-success/10 text-success border-success/20";
      case "rejected":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "settled":
        return "bg-primary/10 text-primary border-primary/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatClaimType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1) + " Insurance";
  };

  if (claims.length === 0) {
    return (
      <Card className="shadow-card border-border/50">
        <CardHeader className="text-center py-12">
          <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-xl text-muted-foreground">No Claims Submitted</CardTitle>
          <CardDescription>
            Your submitted claims will appear here for tracking and status updates
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="shadow-card border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Claims Status</CardTitle>
            <CardDescription>
              Track your encrypted insurance claims in real-time
            </CardDescription>
          </div>
          <Badge variant="secondary" className="bg-security/10 text-security border-security/20">
            <Shield className="w-3 h-3 mr-1" />
            {claims.length} Encrypted Claims
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {claims.map((claim) => (
            <div
              key={claim.id}
              className="border border-border/50 rounded-lg p-4 hover:shadow-card transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{claim.id}</h3>
                    <p className="text-sm text-muted-foreground">
                      {formatClaimType(claim.claimType)}
                    </p>
                  </div>
                </div>
                
                <Badge 
                  variant="secondary" 
                  className={`${getStatusColor(claim.status)} flex items-center space-x-1`}
                >
                  {getStatusIcon(claim.status)}
                  <span className="capitalize">{claim.status}</span>
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-xs text-muted-foreground">Amount</p>
                  <p className="font-semibold">${claim.claimAmount}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Submitted</p>
                  <p className="font-semibold text-sm">{formatDate(claim.submittedAt)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Encryption</p>
                  <div className="flex items-center">
                    <Shield className="w-3 h-3 text-security mr-1" />
                    <span className="text-sm font-semibold text-security">AES-256</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Type</p>
                  <p className="font-semibold text-sm">{claim.claimType.toUpperCase()}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t border-border/30">
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  Last updated: {formatDate(claim.submittedAt)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ClaimsStatus;