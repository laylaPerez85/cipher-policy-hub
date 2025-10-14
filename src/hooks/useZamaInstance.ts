import { useState, useEffect } from 'react';
import { createInstance, initSDK, SepoliaConfig } from '@zama-fhe/relayer-sdk/bundle';

export function useZamaInstance() {
  const [instance, setInstance] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const initZama = async () => {
      try {
        console.log('🔧 Starting FHE SDK initialization...');
        setIsLoading(true);
        setError(null);
        
        console.log('📡 Calling initSDK()...');
        await initSDK();
        console.log('✅ initSDK() completed successfully');

        console.log('🏗️ Creating Zama instance with SepoliaConfig...');
        const zamaInstance = await createInstance(SepoliaConfig);
        console.log('✅ Zama instance created successfully:', zamaInstance);

        if (mounted) {
          setInstance(zamaInstance);
          console.log('🎉 FHE SDK initialization completed successfully');
        }
      } catch (err) {
        console.error('❌ Failed to initialize Zama instance:', err);
        console.error('Error details:', {
          name: err?.name,
          message: err?.message,
          stack: err?.stack
        });
        if (mounted) {
          setError('Failed to initialize encryption service');
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initZama();

    return () => {
      mounted = false;
    };
  }, []);

  return { instance, isLoading, error };
}
