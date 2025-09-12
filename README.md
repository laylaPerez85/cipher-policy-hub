# Cipher Policy Hub

A decentralized insurance platform built with FHE (Fully Homomorphic Encryption) technology for secure and private claim processing.

## Features

- **End-to-End Encryption**: All sensitive data is encrypted using FHE technology
- **Blockchain Integration**: Smart contracts handle policy creation, claim submission, and settlement processing
- **Wallet Integration**: Connect with popular wallets like MetaMask, Rainbow, and more
- **Real-time Processing**: Instant claim submission and status tracking
- **Privacy-First**: Your personal information remains encrypted throughout the entire process

## Technologies Used

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI
- **Blockchain**: Ethereum, Wagmi, RainbowKit
- **Encryption**: FHE (Fully Homomorphic Encryption) via Zama
- **Smart Contracts**: Solidity with FHE support

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/laylaPerez85/cipher-policy-hub.git

# Navigate to the project directory
cd cipher-policy-hub

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Environment Setup

Create a `.env.local` file in the root directory:

```env
VITE_WALLET_CONNECT_PROJECT_ID=your_project_id_here
VITE_CONTRACT_ADDRESS=your_contract_address_here
```

## Smart Contract

The project includes a Solidity smart contract (`CipherPolicyHub.sol`) that handles:

- Policy creation and management
- Encrypted claim submission
- Risk assessment
- Settlement processing
- Reputation management

### Contract Features

- **FHE Integration**: Core data is encrypted using FHE operations
- **Policy Management**: Create and manage insurance policies
- **Claim Processing**: Submit and process claims with encrypted amounts
- **Settlement**: Automated settlement processing
- **Risk Assessment**: Encrypted risk scoring system

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Project Structure

```
src/
├── components/          # React components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── pages/              # Page components
└── contracts/          # Smart contract files
```

## Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main branch

### Manual Deployment

```bash
# Build the project
npm run build

# Deploy the dist folder to your hosting provider
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support and questions, please open an issue on GitHub.
