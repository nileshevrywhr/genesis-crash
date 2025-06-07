import { useState, useEffect } from 'react';
import { Platform } from 'react-native';

interface NetworkState {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  type: string | null;
}

export function useNetworkState(): NetworkState {
  const [networkState, setNetworkState] = useState<NetworkState>({
    isConnected: true,
    isInternetReachable: true,
    type: Platform.OS === 'web' ? 'web' : 'mobile',
  });

  useEffect(() => {
    if (Platform.OS === 'web') {
      // For web, use navigator.onLine
      const updateOnlineStatus = () => {
        setNetworkState({
          isConnected: navigator.onLine,
          isInternetReachable: navigator.onLine,
          type: 'web',
        });
      };

      updateOnlineStatus();

      window.addEventListener('online', updateOnlineStatus);
      window.addEventListener('offline', updateOnlineStatus);

      return () => {
        window.removeEventListener('online', updateOnlineStatus);
        window.removeEventListener('offline', updateOnlineStatus);
      };
    } else {
      // For mobile platforms, assume connected by default
      // We'll handle network errors in the API service layer
      setNetworkState({
        isConnected: true,
        isInternetReachable: true,
        type: 'mobile',
      });
    }
  }, []);

  return networkState;
}
