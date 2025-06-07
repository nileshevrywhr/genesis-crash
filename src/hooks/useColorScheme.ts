import { useColorScheme as useNativeColorScheme } from 'react-native';
import { lightTheme, darkTheme } from '../styles/theme';
import { Theme } from '../types';

export function useColorScheme(): Theme {
  const colorScheme = useNativeColorScheme();
  return colorScheme === 'dark' ? darkTheme : lightTheme;
}
