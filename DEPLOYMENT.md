# Vercel Deployment Guide for Cipher Policy Hub

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Ensure your code is pushed to GitHub
3. **Environment Variables**: Prepare your configuration values

## Step-by-Step Deployment Process

### Step 1: Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click on "New Project" or "Import Project"
3. Select "Import Git Repository"
4. Choose your GitHub account and find `cipher-policy-hub`
5. Click "Import"

### Step 2: Configure Project Settings

#### Basic Configuration
- **Project Name**: `cipher-policy-hub` (or your preferred name)
- **Framework Preset**: `Vite`
- **Root Directory**: `./` (default)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

#### Environment Variables
Click on "Environment Variables" and add the following:

```
VITE_WALLET_CONNECT_PROJECT_ID=your_walletconnect_project_id
VITE_CONTRACT_ADDRESS=your_deployed_contract_address
VITE_RPC_URL=https://sepolia.infura.io/v3/your_infura_key
VITE_CHAIN_ID=11155111
```

**Important Notes:**
- Replace `your_walletconnect_project_id` with your actual WalletConnect Project ID from [cloud.walletconnect.com](https://cloud.walletconnect.com)
- Replace `your_deployed_contract_address` with your deployed smart contract address
- Replace `your_infura_key` with your Infura API key for Sepolia testnet
- Chain ID `11155111` is for Sepolia testnet

### Step 3: Advanced Configuration

#### Build Settings
- **Node.js Version**: `18.x` (recommended)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

#### Domain Configuration (Optional)
1. Go to Project Settings → Domains
2. Add your custom domain if you have one
3. Follow the DNS configuration instructions

### Step 4: Deploy

1. Click "Deploy" button
2. Wait for the build process to complete (usually 2-5 minutes)
3. Your application will be available at the provided Vercel URL

### Step 5: Post-Deployment Configuration

#### Update Contract Address
1. After deploying your smart contract, update the `VITE_CONTRACT_ADDRESS` environment variable
2. Redeploy the application

#### Configure WalletConnect
1. Get your Project ID from [WalletConnect Cloud](https://cloud.walletconnect.com)
2. Update the `VITE_WALLET_CONNECT_PROJECT_ID` environment variable
3. Redeploy if needed

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_WALLET_CONNECT_PROJECT_ID` | WalletConnect Project ID | `abc123def456` |
| `VITE_CONTRACT_ADDRESS` | Deployed contract address | `0x1234...5678` |
| `VITE_RPC_URL` | Ethereum RPC endpoint | `https://sepolia.infura.io/v3/...` |
| `VITE_CHAIN_ID` | Ethereum chain ID | `11155111` (Sepolia) |

## Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel account created
- [ ] Project imported from GitHub
- [ ] Environment variables configured
- [ ] Build settings verified
- [ ] Initial deployment successful
- [ ] Custom domain configured (if applicable)
- [ ] Contract address updated
- [ ] WalletConnect Project ID configured
- [ ] Final deployment completed

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version (use 18.x)
   - Verify all dependencies are in package.json
   - Check for TypeScript errors

2. **Environment Variables Not Working**
   - Ensure variables start with `VITE_`
   - Redeploy after adding new variables
   - Check variable names match exactly

3. **Wallet Connection Issues**
   - Verify WalletConnect Project ID
   - Check RPC URL is accessible
   - Ensure contract address is correct

4. **Contract Interaction Failures**
   - Verify contract is deployed
   - Check contract address is correct
   - Ensure user is on correct network (Sepolia)

### Support

If you encounter issues:
1. Check Vercel deployment logs
2. Verify environment variables
3. Test locally with `npm run dev`
4. Check browser console for errors

## Production Considerations

1. **Security**: Never commit private keys or sensitive data
2. **Performance**: Optimize images and assets
3. **Monitoring**: Set up error tracking (Sentry, etc.)
4. **Backup**: Keep regular backups of your code
5. **Updates**: Regularly update dependencies

## Next Steps

After successful deployment:
1. Test all functionality
2. Set up monitoring
3. Configure custom domain
4. Set up CI/CD for automatic deployments
5. Consider setting up staging environment
