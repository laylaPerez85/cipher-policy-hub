import { Shield, Lock, TrendingUp } from "lucide-react";
import heroImage from "@/assets/insurance-hero.jpg";

const DashboardHeader = () => {
  return (
    <header className="relative bg-gradient-hero text-primary-foreground overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <img 
          src={heroImage} 
          alt="Insurance Security Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-hero"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-6 py-16">
        <div className="flex items-center justify-center mb-6">
          <Shield className="w-12 h-12 mr-4 text-security" />
          <div className="flex items-center space-x-2">
            <Lock className="w-8 h-8 text-primary-foreground/80" />
            <TrendingUp className="w-8 h-8 text-primary-foreground/80" />
          </div>
        </div>
        
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4 tracking-tight">
            Private Claims, Transparent Settlement
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto leading-relaxed">
            Submit and process insurance claims with end-to-end encryption, 
            protecting your sensitive information while ensuring transparent settlements.
          </p>
          
          <div className="flex justify-center items-center mt-8 space-x-8 text-sm text-primary-foreground/80">
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-2 text-security" />
              <span>256-bit Encryption</span>
            </div>
            <div className="flex items-center">
              <Lock className="w-4 h-4 mr-2" />
              <span>Blockchain Secured</span>
            </div>
            <div className="flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              <span>Instant Processing</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;