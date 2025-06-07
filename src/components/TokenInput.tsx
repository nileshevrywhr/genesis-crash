import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { TokenInputProps } from '../types';
import { useColorScheme } from '../hooks/useColorScheme';
import { validateToken } from '../utils/validation';

export const TokenInput: React.FC<TokenInputProps> = ({
  value,
  onChangeText,
  onSubmit,
  isLoading,
  error,
  onClear,
}) => {
  const theme = useColorScheme();
  const [isSecure, setIsSecure] = useState(true);
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = () => {
    const validation = validateToken(value);
    if (!validation.isValid) {
      Alert.alert('Invalid Token', validation.error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onSubmit();
  };

  const handleClear = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClear();
  };

  const toggleSecure = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsSecure(!isSecure);
  };

  const styles = createStyles(theme, isFocused, !!error);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Genesis Cloud API Token</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder="Enter your Bearer token..."
          placeholderTextColor={theme.colors.textSecondary}
          secureTextEntry={isSecure}
          autoCapitalize="none"
          autoCorrect={false}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          editable={!isLoading}
          multiline={false}
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
        />
        
        <View style={styles.inputActions}>
          {value.length > 0 && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={toggleSecure}
              disabled={isLoading}
            >
              <Ionicons
                name={isSecure ? 'eye-off' : 'eye'}
                size={20}
                color={theme.colors.textSecondary}
              />
            </TouchableOpacity>
          )}
          
          {value.length > 0 && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleClear}
              disabled={isLoading}
            >
              <Ionicons
                name="close-circle"
                size={20}
                color={theme.colors.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={16} color={theme.colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={isLoading || !value.trim()}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.submitButtonText}>Connecting...</Text>
          </View>
        ) : (
          <>
            <Ionicons name="cloud" size={20} color="#FFFFFF" />
            <Text style={styles.submitButtonText}>Connect to Genesis Cloud</Text>
          </>
        )}
      </TouchableOpacity>

      <Text style={styles.helpText}>
        Enter your Genesis Cloud API token to fetch compute instances
      </Text>
    </View>
  );
};

const createStyles = (theme: any, isFocused: boolean, hasError: boolean) =>
  StyleSheet.create({
    container: {
      padding: theme.spacing.md,
    },
    label: {
      fontSize: theme.typography.body.fontSize,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: hasError
        ? theme.colors.error
        : isFocused
        ? theme.colors.primary
        : theme.colors.border,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.surface,
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.sm,
    },
    input: {
      flex: 1,
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.text,
      paddingVertical: theme.spacing.md,
      minHeight: 48,
    },
    inputActions: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    actionButton: {
      padding: theme.spacing.xs,
      marginLeft: theme.spacing.xs,
    },
    errorContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    errorText: {
      fontSize: theme.typography.caption.fontSize,
      color: theme.colors.error,
      marginLeft: theme.spacing.xs,
      flex: 1,
    },
    submitButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.md,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.sm,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    submitButtonDisabled: {
      backgroundColor: theme.colors.textSecondary,
      elevation: 0,
      shadowOpacity: 0,
    },
    submitButtonText: {
      color: '#FFFFFF',
      fontSize: theme.typography.body.fontSize,
      fontWeight: '600',
      marginLeft: theme.spacing.sm,
    },
    loadingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    helpText: {
      fontSize: theme.typography.caption.fontSize,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: 18,
    },
  });
