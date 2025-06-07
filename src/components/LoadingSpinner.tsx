import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { LoadingSpinnerProps } from '../types';
import { useColorScheme } from '../hooks/useColorScheme';

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'large', 
  color 
}) => {
  const theme = useColorScheme();
  const spinnerColor = color || theme.colors.primary;

  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={spinnerColor} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});
