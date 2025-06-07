import { Platform } from 'react-native';
import { GenesisApiResponse, GenesisInstance, ApiError } from '../types';
import { formatToken } from '../utils/validation';

// Use proxy server for web browsers to avoid CORS issues
// Use direct API for mobile platforms
const getBaseUrl = () => {
  if (Platform.OS === 'web') {
    return __DEV__
      ? 'http://localhost:3001/api/genesis'
      : 'https://api.genesiscloud.com/compute/v1';
  } else {
    // Mobile platforms can connect directly to the API
    return 'https://api.genesiscloud.com/compute/v1';
  }
};

const BASE_URL = getBaseUrl();

export class GenesisApiService {
  private static async makeRequest<T>(
    endpoint: string,
    token: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;
    const formattedToken = formatToken(token);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Authorization': formattedToken,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch {
          // If we can't parse the error response, use the default message
        }

        const apiError: ApiError = {
          message: errorMessage,
          status: response.status,
          details: response.statusText,
        };

        throw apiError;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('Network request failed')) {
        throw {
          message: 'Network error. Please check your internet connection.',
          status: 0,
        } as ApiError;
      }

      if ((error as ApiError).status !== undefined) {
        throw error;
      }

      throw {
        message: 'An unexpected error occurred',
        details: error instanceof Error ? error.message : 'Unknown error',
      } as ApiError;
    }
  }

  static async getInstances(token: string): Promise<GenesisInstance[]> {
    try {
      const response = await this.makeRequest<GenesisApiResponse>('/instances', token);
      return response.instances || [];
    } catch (error) {
      console.error('Error fetching instances:', error);
      throw error;
    }
  }

  static async getInstance(token: string, instanceId: string): Promise<GenesisInstance> {
    try {
      const response = await this.makeRequest<{ instance: GenesisInstance }>(
        `/instances/${instanceId}`,
        token
      );
      return response.instance;
    } catch (error) {
      console.error('Error fetching instance:', error);
      throw error;
    }
  }

  static async performInstanceAction(
    token: string,
    instanceId: string,
    action: 'start' | 'stop' | 'restart' | 'reboot'
  ): Promise<GenesisInstance> {
    try {
      const response = await this.makeRequest<{ instance: GenesisInstance }>(
        `/instances/${instanceId}/actions`,
        token,
        {
          method: 'POST',
          body: JSON.stringify({ action })
        }
      );
      return response.instance;
    } catch (error) {
      console.error(`Error performing ${action} action on instance:`, error);
      throw error;
    }
  }

  static async startInstance(token: string, instanceId: string): Promise<GenesisInstance> {
    return this.performInstanceAction(token, instanceId, 'start');
  }

  static async testConnection(token: string): Promise<boolean> {
    try {
      await this.getInstances(token);
      return true;
    } catch (error) {
      return false;
    }
  }
}
