import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { GenesisInstance } from '../types';
import { useColorScheme } from '../hooks/useColorScheme';

interface InstanceCardProps {
  instance: GenesisInstance;
  onStart: (instanceId: string) => void;
}

export const InstanceCard: React.FC<InstanceCardProps> = ({ instance, onStart }) => {
  const theme = useColorScheme();

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'running':
        return theme.colors.success;
      case 'stopped':
      case 'stopping':
        return theme.colors.error;
      case 'starting':
        return theme.colors.warning;
      default:
        return theme.colors.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'running':
        return 'checkmark-circle';
      case 'stopped':
        return 'stop-circle';
      case 'stopping':
        return 'pause-circle';
      case 'starting':
        return 'play-circle';
      default:
        return 'help-circle';
    }
  };

  const handleStart = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    if (instance.status.toLowerCase() === 'running') {
      Alert.alert(
        'Instance Already Running',
        `${instance.name} is already running.`,
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }

    Alert.alert(
      'Start Instance',
      `Are you sure you want to start ${instance.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Start', 
          style: 'default',
          onPress: () => onStart(instance.id)
        }
      ]
    );
  };

  const styles = createStyles(theme);

  return (
    <View style={styles.card}>
      {/* Header with name and status */}
      <View style={styles.header}>
        <View style={styles.nameContainer}>
          <Text style={styles.name} numberOfLines={1}>
            {instance.name}
          </Text>
          <Text style={styles.id} numberOfLines={1}>
            ID: {instance.id}
          </Text>
        </View>
        <View style={[styles.statusContainer, { backgroundColor: getStatusColor(instance.status) + '20' }]}>
          <Ionicons 
            name={getStatusIcon(instance.status)} 
            size={16} 
            color={getStatusColor(instance.status)} 
          />
          <Text style={[styles.status, { color: getStatusColor(instance.status) }]}>
            {instance.status.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Instance details */}
      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Ionicons name="hardware-chip" size={16} color={theme.colors.textSecondary} />
          <Text style={styles.detailLabel}>Type:</Text>
          <Text style={styles.detailValue}>{instance.type}</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="globe" size={16} color={theme.colors.textSecondary} />
          <Text style={styles.detailLabel}>Public IP:</Text>
          <Text style={styles.detailValue}>
            {instance.public_ip || 'Not assigned'}
          </Text>
        </View>

        {instance.region && (
          <View style={styles.detailRow}>
            <Ionicons name="location" size={16} color={theme.colors.textSecondary} />
            <Text style={styles.detailLabel}>Region:</Text>
            <Text style={styles.detailValue}>{instance.region.name}</Text>
          </View>
        )}
      </View>

      {/* Action button */}
      <TouchableOpacity
        style={[
          styles.startButton,
          instance.status.toLowerCase() === 'running' && styles.startButtonDisabled
        ]}
        onPress={handleStart}
        disabled={instance.status.toLowerCase() === 'starting'}
      >
        <Ionicons 
          name={instance.status.toLowerCase() === 'running' ? 'checkmark' : 'play'} 
          size={20} 
          color="#FFFFFF" 
        />
        <Text style={styles.startButtonText}>
          {instance.status.toLowerCase() === 'running' ? 'Running' : 
           instance.status.toLowerCase() === 'starting' ? 'Starting...' : 'Start'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: theme.spacing.md,
    },
    nameContainer: {
      flex: 1,
      marginRight: theme.spacing.sm,
    },
    name: {
      fontSize: theme.typography.h2.fontSize,
      fontWeight: theme.typography.h2.fontWeight,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    id: {
      fontSize: theme.typography.caption.fontSize,
      color: theme.colors.textSecondary,
    },
    statusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.md,
    },
    status: {
      fontSize: theme.typography.caption.fontSize,
      fontWeight: '600',
      marginLeft: theme.spacing.xs,
    },
    details: {
      marginBottom: theme.spacing.md,
    },
    detailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    detailLabel: {
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.textSecondary,
      marginLeft: theme.spacing.sm,
      marginRight: theme.spacing.sm,
      minWidth: 80,
    },
    detailValue: {
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.text,
      fontWeight: '500',
      flex: 1,
    },
    startButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.md,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    startButtonDisabled: {
      backgroundColor: theme.colors.success,
    },
    startButtonText: {
      color: '#FFFFFF',
      fontSize: theme.typography.body.fontSize,
      fontWeight: '600',
      marginLeft: theme.spacing.sm,
    },
  });
