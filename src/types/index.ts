// Genesis Cloud API Types
export interface GenesisInstance {
  id: string;
  name: string;
  status: string;
  type: string;
  image: {
    id: string;
    name: string;
  };
  ssh_keys: Array<{
    id: string;
    name: string;
  }>;
  public_ip?: string;
  private_ip?: string;
  created_at: string;
  updated_at: string;
  region: {
    id: string;
    name: string;
  };
  metadata?: Record<string, any>;
}

export interface GenesisApiResponse {
  instances: GenesisInstance[];
  meta?: {
    total: number;
    page: number;
    per_page: number;
  };
}

export interface ApiError {
  message: string;
  status?: number;
  details?: string;
}

// App State Types
export interface AppState {
  token: string;
  isLoading: boolean;
  error: string | null;
  instances: GenesisInstance[];
  lastFetched: Date | null;
}

// Component Props Types
export interface TokenInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  error: string | null;
  onClear: () => void;
}

export interface ApiResponseProps {
  data: GenesisInstance[] | null;
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
  onCopy: () => void;
  onStartInstance: (instanceId: string) => void;
}

export interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
}

// Theme Types
export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    success: string;
    warning: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
  };
  typography: {
    h1: {
      fontSize: number;
      fontWeight: string;
    };
    h2: {
      fontSize: number;
      fontWeight: string;
    };
    body: {
      fontSize: number;
      fontWeight: string;
    };
    caption: {
      fontSize: number;
      fontWeight: string;
    };
  };
}
