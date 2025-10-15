// 错误处理工具函数
export class ErrorHandler {
  static handleWalletError(error: any): string {
    if (error.code === 'UNSUPPORTED_OPERATION') {
      return 'Unsupported operation - check contract ABI';
    } else if (error.code === 'NETWORK_ERROR') {
      return 'Network error - check RPC connection';
    } else if (error.message?.includes('selectExtension')) {
      return 'Wallet extension selection failed - try refreshing the page';
    } else if (error.message?.includes('User rejected')) {
      return 'Transaction rejected by user';
    } else if (error.message?.includes('Insufficient funds')) {
      return 'Insufficient funds for transaction';
    } else if (error.message?.includes('Nonce too low')) {
      return 'Transaction nonce too low - try again';
    } else {
      return error.message || 'Unknown error occurred';
    }
  }

  static logError(context: string, error: any): void {
    console.error(`❌ ${context} failed:`, error);
    console.error('Error details:', {
      name: error?.name,
      message: error?.message,
      stack: error?.stack,
      code: error?.code,
      reason: error?.reason
    });
  }

  static async retryOperation<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: any;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        console.warn(`Attempt ${i + 1} failed:`, error);
        
        if (i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
        }
      }
    }
    
    throw lastError;
  }
}
