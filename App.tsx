import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';

import { TokenInput } from './src/components/TokenInput';
import { ApiResponse } from './src/components/ApiResponse';
import { LoadingSpinner } from './src/components/LoadingSpinner';
import { useColorScheme } from './src/hooks/useColorScheme';
import { useNetworkState } from './src/hooks/useNetworkState';
import { GenesisApiService } from './src/services/genesisApi';
import { secureStorage, appStorage } from './src/utils/storage';
import { GenesisInstance, ApiError } from './src/types';

export default function App() {
  const theme = useColorScheme();
  const networkState = useNetworkState();
  const [token, setToken] = useState('');
  const [instances, setInstances] = useState<GenesisInstance[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Load saved token on app start
  useEffect(() => {
    loadSavedData();
  }, []);

  const loadSavedData = async () => {
    try {
      const savedToken = await secureStorage.getToken();
      if (savedToken) {
        setToken(savedToken);
      }

      const savedState = await appStorage.getAppState();
      if (savedState?.instances) {
        setInstances(savedState.instances);
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    } finally {
      setIsInitializing(false);
    }
  };

  const handleTokenSubmit = async () => {
    if (!token.trim()) {
      Alert.alert('Error', 'Please enter your API token');
      return;
    }

    // Check network connectivity on web
    if (Platform.OS === 'web' && !networkState.isConnected) {
      Alert.alert('No Internet Connection', 'Please check your internet connection and try again.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const fetchedInstances = await GenesisApiService.getInstances(token);
      setInstances(fetchedInstances);

      // Save token and state
      await secureStorage.setToken(token);
      await appStorage.setAppState({
        instances: fetchedInstances,
        lastFetched: new Date().toISOString(),
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to fetch instances');
      setInstances([]);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (!token.trim()) {
      Alert.alert('Error', 'No token available. Please enter your API token.');
      return;
    }

    await handleTokenSubmit();
  };

  const handleCopyResponse = async () => {
    try {
      const jsonData = JSON.stringify(instances, null, 2);
      await Clipboard.setStringAsync(jsonData);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
      Alert.alert('Error', 'Failed to copy to clipboard');
    }
  };

  const handleStartInstance = async (instanceId: string) => {
    if (!token.trim()) {
      Alert.alert('Error', 'No token available');
      return;
    }

    try {
      setIsLoading(true);
      const updatedInstance = await GenesisApiService.startInstance(token, instanceId);

      // Update the instance in the local state
      setInstances(prevInstances =>
        prevInstances.map(instance =>
          instance.id === instanceId ? updatedInstance : instance
        )
      );

      // Save updated state
      const updatedInstances = instances.map(instance =>
        instance.id === instanceId ? updatedInstance : instance
      );
      await appStorage.setAppState({
        instances: updatedInstances,
        lastFetched: new Date().toISOString(),
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Success', `Instance ${updatedInstance.name} is starting!`);
    } catch (err) {
      const apiError = err as ApiError;
      Alert.alert('Error', `Failed to start instance: ${apiError.message}`);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearToken = async () => {
    setToken('');
    setInstances([]);
    setError(null);

    try {
      await secureStorage.removeToken();
      await appStorage.removeAppState();
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  };

  const styles = createStyles(theme);

  if (isInitializing) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style={theme.colors.background === '#000000' ? 'light' : 'dark'} />
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style={theme.colors.background === '#000000' ? 'light' : 'dark'} />

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Genesis Cloud</Text>
          <Text style={styles.subtitle}>Compute Instances API</Text>
        </View>

        <TokenInput
          value={token}
          onChangeText={setToken}
          onSubmit={handleTokenSubmit}
          isLoading={isLoading}
          error={error}
          onClear={handleClearToken}
        />

        <View style={styles.responseContainer}>
          <ApiResponse
            data={instances}
            isLoading={isLoading}
            error={error}
            onRefresh={handleRefresh}
            onCopy={handleCopyResponse}
            onStartInstance={handleStartInstance}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    keyboardAvoidingView: {
      flex: 1,
    },
    header: {
      padding: theme.spacing.lg,
      paddingBottom: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    title: {
      fontSize: theme.typography.h1.fontSize,
      fontWeight: theme.typography.h1.fontWeight,
      color: theme.colors.text,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginTop: theme.spacing.xs,
    },
    responseContainer: {
      flex: 1,
    },
  });
