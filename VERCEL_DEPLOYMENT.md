# Vercel Deployment Guide

## 🚀 Vercel Deployment Configuration Parameters

### 1. Environment Variables Configuration

Set the following environment variables in Vercel Dashboard:

#### Required Environment Variables
```bash
# Network Configuration
VITE_SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY
VITE_ETHERSCAN_API_KEY=YOUR_ETHERSCAN_API_KEY

# Wallet Connection
VITE_WALLET_CONNECT_PROJECT_ID=

# Contract Configuration
VITE_CONTRACT_ADDRESS=0x0bB6aBf1Acf6526d8866e273a347A046D2825D78
VITE_CHAIN_ID=11155111

# FHE SDK Configuration
VITE_FHE_SDK_URL=https://cdn.zama.ai/relayer-sdk-js/0.2.0/relayer-sdk-js.umd.cjs

# Build Configuration
NODE_ENV=production
VITE_NODE_ENV=production
```

### 2. Build Configuration

#### Build Command
```bash
npm run build
```

#### Output Directory
```
dist
```

#### Install Command
```bash
npm install
```

### 3. Deployment Settings

#### Framework Preset
```
Vite
```

#### Root Directory
```
./
```

#### Node.js Version
```
18.x
```

### 4. Domain Configuration

#### Custom Domain (Optional)
```
cipher-policy-hub.vercel.app
```

### 5. Deployment Steps

1. **Connect GitHub Repository**
   - Click "New Project" in Vercel Dashboard
   - Select GitHub repository: `laylaPerez85/cipher-policy-hub`

2. **Configure Environment Variables**
   - Add the above environment variables in project settings
   - Ensure all `VITE_` prefixed variables are correctly set

3. **Deployment Settings**
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Deploy**
   - Click "Deploy" to start deployment
   - Wait for build completion

### 6. Special Configuration Notes

#### FHE SDK CDN Configuration
The project uses Zama FHE SDK, which needs to be loaded via CDN in `index.html`:
```html
<script src="https://cdn.zama.ai/relayer-sdk-js/0.2.0/relayer-sdk-js.umd.cjs" type="text/javascript"></script>
```

#### Vite Configuration
The project uses special Vite configuration to support FHE SDK:
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  define: { global: 'globalThis' },
  optimizeDeps: { include: ['@zama-fhe/relayer-sdk/bundle'] }
})
```

### 7. Post-Deployment Verification

1. **Access Deployment URL**
   - Check if the application loads correctly
   - Verify wallet connection functionality

2. **Test FHE Features**
   - Create insurance policies
   - Submit encrypted claims
   - Test decryption functionality

3. **Check Console**
   - Ensure no JavaScript errors
   - Verify FHE SDK loads correctly

### 8. Troubleshooting

#### Common Issues
1. **FHE SDK Loading Failure**
   - Check if CDN link is correct
   - Verify network connection

2. **Wallet Connection Failure**
   - Check WalletConnect project ID
   - Verify RPC URL configuration

3. **Contract Call Failure**
   - Check contract address
   - Verify network configuration

#### Debug Steps
1. Check browser console errors
2. Verify environment variable settings
3. Test network connection
4. Check contract deployment status

### 9. Performance Optimization

#### Build Optimization
- Enable code splitting
- Compress static assets
- Optimize image resources

#### Caching Strategy
- Long-term caching for static assets
- Appropriate caching for API responses
- CDN acceleration configuration

### 10. Monitoring and Maintenance

#### Deployment Monitoring
- Set up deployment notifications
- Monitor build status
- Check error logs

#### Update Process
1. Push code to GitHub
2. Vercel automatically triggers deployment
3. Verify new version functionality
4. Rollback if needed

---

**After deployment, your FHE-encrypted insurance platform will be running on Vercel!**