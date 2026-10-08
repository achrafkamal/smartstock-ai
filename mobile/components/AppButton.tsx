import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import { theme } from '../constants/theme';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const AppButton: React.FC<AppButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const isInteractive = !disabled && !loading;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={isInteractive ? onPress : undefined}
      style={[
        styles.base,
        styles[variant],
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' ? theme.colors.primary : '#FFFFFF'}
        />
      ) : (
        <Text
          style={[
            styles.textBase,
            styles[`text_${variant}` as keyof typeof styles],
            disabled && styles.textDisabled,
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    height: 48,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.md,
  },
  primary: {
    backgroundColor: theme.colors.primary,
  },
  secondary: {
    backgroundColor: theme.colors.primaryLight,
  },
  danger: {
    backgroundColor: theme.colors.danger,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
  },
  disabled: {
    backgroundColor: theme.colors.border,
    borderColor: theme.colors.border,
  },
  textBase: {
    fontSize: 15,
    fontWeight: '600',
  },
  text_primary: {
    color: '#FFFFFF',
  },
  text_secondary: {
    color: theme.colors.primary,
  },
  text_danger: {
    color: '#FFFFFF',
  },
  text_outline: {
    color: theme.colors.primary,
  },
  textDisabled: {
    color: theme.colors.textMuted,
  },
});

export default AppButton;
