# Cipher Policy Hub - FHE Encrypted Insurance Platform

A fully homomorphic encryption (FHE) powered decentralized insurance platform that enables secure, private claim submissions and policy management on the blockchain.

## 🔐 Features

### FHE Encryption Technology
- **End-to-End Encryption**: All sensitive claim data is encrypted using Zama's FHE technology
- **Privacy-Preserving**: Claim details remain encrypted even during processing
- **Decrypt on Demand**: Users can decrypt and view their own encrypted data
- **Zero-Knowledge Processing**: Insurance logic operates on encrypted data without revealing sensitive information

### Core Functionality
- **Policy Creation**: Create and manage insurance policies with encrypted premium and coverage amounts
- **Encrypted Claim Submission**: Submit insurance claims with all sensitive data FHE encrypted
- **User-Specific Policies**: Each user can create and manage their own insurance policies
- **Real-time Decryption**: View and decrypt submitted claims with proper authentication
- **Policy Selection**: Dropdown interface for selecting user-specific policies

### Encrypted Data Fields
- **Claim Type** (Health, Auto, Property, Life, Disability)
- **Claim Amount** (FHE encrypted financial data)
- **Policy Number** (FHE encrypted policy identification)
- **Contact Information** (FHE encrypted personal details)
- **Description** (FHE encrypted claim narrative)

## 🚀 Demo Video

Watch the complete FHE encryption workflow in action:

[![FHE Insurance Demo](https://img.shields.io/badge/Demo-Video-blue)](Claim_fhe_compressed.mp4)

**Demo Video**: [Claim_fhe_compressed.mp4](Claim_fhe_compressed.mp4) (3.3MB)

## 🏗️ Smart Contract

**Contract Address**: `0x0bB6aBf1Acf6526d8866e273a347A046D2825D78`  
**Network**: Sepolia Testnet  
**Etherscan**: [View Contract](https://sepolia.etherscan.io/address/0x0bB6aBf1Acf6526d8866e273a347A046D2825D78)

### Key Functions
- `createSimplePolicy()` - Create new insurance policies
- `submitSimpleClaim()` - Submit FHE encrypted claims
- `getClaimEncryptedData()` - Retrieve encrypted claim data for decryption
- `getUserClaims()` - Get user's claim history
- `getPolicyInfo()` - Retrieve policy details

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **shadcn/ui** for components
- **Wagmi v2** for wallet integration

### Blockchain
- **Hardhat** for smart contract development
- **FHEVM Solidity** for FHE encryption
- **Zama FHE SDK** for client-side encryption
- **Ethers.js** for blockchain interaction

### FHE Implementation
- **@fhevm/solidity** - On-chain FHE operations
- **@zama-fhe/relayer-sdk** - Client-side encryption
- **@fhevm/hardhat-plugin** - Development tools

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Git
- MetaMask or compatible wallet
- Sepolia ETH for gas fees

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/laylaPerez85/cipher-policy-hub.git
cd cipher-policy-hub
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
cp .env.example .env
# Add your environment variables
```

4. **Start development server**
```bash
npm run dev
```

5. **Open in browser**
Navigate to `http://localhost:5173`

### Demo Workflow

1. **Connect Wallet**: Connect your MetaMask wallet to Sepolia testnet
2. **Create Policy**: Create a new insurance policy with your details
3. **Submit Claim**: Submit an encrypted insurance claim
4. **View Claims**: Browse your submitted claims
5. **Decrypt Data**: Decrypt and view your encrypted claim details

## 🔧 Development

### Smart Contract Development
```bash
# Compile contracts
npm run compile

# Deploy to local network
npm run deploy:local

# Deploy to Sepolia
npm run deploy

# Run tests
npm run test
```

### Frontend Development
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
cipher-policy-hub/
├── contracts/           # Smart contracts
│   └── CipherPolicyHub.sol
├── src/                # Frontend source
│   ├── components/     # React components
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utilities and configs
│   └── pages/          # Application pages
├── scripts/            # Deployment scripts
├── public/             # Static assets
└── docs/               # Documentation
```

## 🔐 Security Features

- **FHE Encryption**: All sensitive data encrypted using Zama's FHE technology
- **Zero-Knowledge Processing**: Smart contracts operate on encrypted data
- **User Authentication**: Wallet-based identity verification
- **Access Control**: Users can only decrypt their own data
- **Privacy by Design**: No sensitive data stored in plaintext

## 🌐 Network Configuration

### Sepolia Testnet
- **RPC URL**: `https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY`
- **Chain ID**: `11155111`
- **Explorer**: `https://sepolia.etherscan.io`

## 📊 FHE Technology Implementation

### Encryption Process
1. **Client-Side Encryption**: Data encrypted using Zama FHE SDK
2. **Handle Generation**: FHE handles created for encrypted data
3. **Proof Creation**: Cryptographic proof for FHE operations
4. **On-Chain Storage**: Encrypted data stored in smart contract
5. **Decryption**: User can decrypt their own data with proper authentication

### Supported Data Types
- **euint8**: 8-bit encrypted integers (claim types)
- **euint32**: 32-bit encrypted integers (amounts, IDs)
- **External FHE Types**: For client-contract communication

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Zama** for FHE technology and SDK
- **FHEVM** for Solidity FHE implementation
- **Hardhat** for development framework
- **React** and **Vite** for frontend framework

## 📞 Support

For questions and support:
- Create an issue on GitHub
- Contact: [laylaPerez85](https://github.com/laylaPerez85)

---

**Built with ❤️ using FHE technology for privacy-preserving insurance**