import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const TOKEN_KEY = 'genesis_cloud_token';
const APP_STATE_KEY = 'genesis_cloud_app_state';

// Check if we're running on web
const isWeb = Platform.OS === 'web';

export const secureStorage = {
  async setToken(token: string): Promise<void> {
    try {
      if (isWeb) {
        // Use localStorage for web browsers
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem(TOKEN_KEY, token);
        } else {
          throw new Error('localStorage not available');
        }
      } else {
        // Use SecureStore for mobile platforms
        await SecureStore.setItemAsync(TOKEN_KEY, token);
      }
    } catch (error) {
      console.error('Error storing token:', error);
      throw new Error('Failed to store token securely');
    }
  },

  async getToken(): Promise<string | null> {
    try {
      if (isWeb) {
        // Use localStorage for web browsers
        if (typeof window !== 'undefined' && window.localStorage) {
          return window.localStorage.getItem(TOKEN_KEY);
        } else {
          return null;
        }
      } else {
        // Use SecureStore for mobile platforms
        return await SecureStore.getItemAsync(TOKEN_KEY);
      }
    } catch (error) {
      console.error('Error retrieving token:', error);
      return null;
    }
  },

  async removeToken(): Promise<void> {
    try {
      if (isWeb) {
        // Use localStorage for web browsers
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.removeItem(TOKEN_KEY);
        }
      } else {
        // Use SecureStore for mobile platforms
        await SecureStore.deleteItemAsync(TOKEN_KEY);
      }
    } catch (error) {
      console.error('Error removing token:', error);
    }
  },
};

export const appStorage = {
  async setAppState(state: any): Promise<void> {
    try {
      const jsonValue = JSON.stringify(state);
      if (isWeb) {
        // Use localStorage for web browsers
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem(APP_STATE_KEY, jsonValue);
        }
      } else {
        // Use AsyncStorage for mobile platforms
        await AsyncStorage.setItem(APP_STATE_KEY, jsonValue);
      }
    } catch (error) {
      console.error('Error storing app state:', error);
    }
  },

  async getAppState(): Promise<any | null> {
    try {
      let jsonValue: string | null = null;

      if (isWeb) {
        // Use localStorage for web browsers
        if (typeof window !== 'undefined' && window.localStorage) {
          jsonValue = window.localStorage.getItem(APP_STATE_KEY);
        }
      } else {
        // Use AsyncStorage for mobile platforms
        jsonValue = await AsyncStorage.getItem(APP_STATE_KEY);
      }

      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error retrieving app state:', error);
      return null;
    }
  },

  async removeAppState(): Promise<void> {
    try {
      if (isWeb) {
        // Use localStorage for web browsers
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.removeItem(APP_STATE_KEY);
        }
      } else {
        // Use AsyncStorage for mobile platforms
        await AsyncStorage.removeItem(APP_STATE_KEY);
      }
    } catch (error) {
      console.error('Error removing app state:', error);
    }
  },
};
