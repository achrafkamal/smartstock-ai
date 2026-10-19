import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../store/authStore';
import { useLoginMutation } from '../services/auth';
import { theme } from '../constants/theme';
import { AppInput } from '../components/AppInput';
import { AppButton } from '../components/AppButton';

export default function LoginScreen() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const loginMutation = useLoginMutation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLocalError(null);

    if (!email.trim() || !password.trim()) {
      setLocalError('Veuillez saisir votre email et mot de passe');
      return;
    }

    try {
      const data = await loginMutation.mutateAsync({
        email: email.trim(),
        password,
      });
      setAuth(data.user, data.token);
      router.replace('/dashboard' as any);
    } catch (err: any) {
      setLocalError(err.message || 'Échec de connexion');
    }
  };

  const fillDemoAdmin = () => {
    setEmail('admin@smartstock.ma');
    setPassword('Password123');
    setLocalError(null);
  };

  const displayError = localError || loginMutation.error?.message;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          {/* Brand Header */}
          <View style={styles.header}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoText}></Text>
            </View>
            <Text style={styles.title}>SmartStock AI</Text>
            <Text style={styles.subtitle}>Ma7alkom Stock Management</Text>
          </View>

          {/* Error Banner */}
          {displayError ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{displayError}</Text>
            </View>
          ) : null}

          {/* Form */}
          <AppInput
            label="Adresse Email"
            placeholder="admin@smartstock.ma"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <AppInput
            label="Mot de passe"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <AppButton
            title="Se Connecter"
            onPress={handleLogin}
            loading={loginMutation.isPending}
            style={styles.submitBtn}
          />

          {/* Demo helper */}
          <TouchableOpacity onPress={fillDemoAdmin} style={styles.demoHelper}>
            <Text style={styles.demoText}>Remplir les identifiants démo (Admin)</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  logoBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  logoText: {
    fontSize: 28,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  errorBox: {
    backgroundColor: theme.colors.dangerLight,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  errorText: {
    color: theme.colors.danger,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  submitBtn: {
    marginTop: theme.spacing.xs,
  },
  demoHelper: {
    marginTop: theme.spacing.md,
    alignItems: 'center',
    paddingVertical: 4,
  },
  demoText: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
