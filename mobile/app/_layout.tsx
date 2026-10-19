import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClientProvider } from '@tanstack/react-query';
import { theme } from '../constants/theme';
import { queryClient } from '../services/queryClient';

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.surface,
          },
          headerTintColor: theme.colors.primary,
          headerTitleStyle: {
            fontWeight: '700',
            color: theme.colors.text,
            fontSize: 17,
          },
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: theme.colors.background,
          },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen
          name="dashboard"
          options={{
            title: 'Tableau de Bord',
            headerBackVisible: false,
          }}
        />
        <Stack.Screen
          name="products"
          options={{
            title: 'Catalogue Produits',
          }}
        />
        <Stack.Screen
          name="product/[id]"
          options={{
            title: 'Détails Produit',
          }}
        />
        <Stack.Screen
          name="stock"
          options={{
            title: 'Gestion de Stock',
          }}
        />
      </Stack>
    </QueryClientProvider>
  );
}
