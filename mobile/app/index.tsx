import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../store/authStore';
import { theme } from '../constants/theme';

export default function Index() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    // Short tick to allow navigation mounting
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        router.replace('/dashboard' as any);
      } else {
        router.replace('/login' as any);
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [isAuthenticated, router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
