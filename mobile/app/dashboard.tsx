import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../store/authStore';
import { useProductStore } from '../store/productStore';
import { useStockStore } from '../store/stockStore';
import { theme } from '../constants/theme';
import { StockCard } from '../components/StockCard';
import { AppButton } from '../components/AppButton';

export default function DashboardScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { products, fetchProducts, loading: productsLoading } = useProductStore();
  const { movements, fetchMovements, loading: stockLoading } = useStockStore();

  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    await Promise.all([fetchProducts(), fetchMovements()]);
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleLogout = () => {
    logout();
    router.replace('/login' as any);
  };

  // KPIs calculations
  const totalProducts = products.length;
  const lowStockCount = products.filter(
    (p) => p.quantity <= p.lowStockThreshold
  ).length;
  const totalQuantity = products.reduce((sum, p) => sum + Number(p.quantity || 0), 0);
  const recentMovements = movements.slice(0, 5);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing || (productsLoading && stockLoading)}
          onRefresh={onRefresh}
          colors={[theme.colors.primary]}
        />
      }
    >
      {/* User Header */}
      <View style={styles.userBar}>
        <View>
          <Text style={styles.greeting}>Bonjour,</Text>
          <Text style={styles.userName}>{user?.name || 'Administrateur'}</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>
      </View>

      {/* KPI Cards Grid */}
      <View style={styles.kpiGrid}>
        <View style={[styles.kpiCard, { borderLeftColor: theme.colors.primary }]}>
          <Text style={styles.kpiLabel}>Total Produits</Text>
          <Text style={styles.kpiValue}>{totalProducts}</Text>
        </View>

        <View
          style={[
            styles.kpiCard,
            {
              borderLeftColor:
                lowStockCount > 0 ? theme.colors.warning : theme.colors.success,
            },
          ]}
        >
          <Text style={styles.kpiLabel}>Stock Faible</Text>
          <Text
            style={[
              styles.kpiValue,
              { color: lowStockCount > 0 ? theme.colors.warning : theme.colors.success },
            ]}
          >
            {lowStockCount}
          </Text>
        </View>

        <View style={[styles.kpiCard, { borderLeftColor: theme.colors.info }]}>
          <Text style={styles.kpiLabel}>Unités en Stock</Text>
          <Text style={styles.kpiValue}>{totalQuantity}</Text>
        </View>
      </View>

      {/* Action Navigation Buttons */}
      <View style={styles.actionsContainer}>
        <AppButton
          title="📦 Catalogue Produits"
          onPress={() => router.push('/products' as any)}
          style={styles.actionBtn}
        />
        <AppButton
          title="🔄 Mouvements Stock"
          variant="secondary"
          onPress={() => router.push('/stock' as any)}
          style={styles.actionBtn}
        />
      </View>

      {/* Recent Activity Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Mouvements Récents</Text>
        <TouchableOpacity onPress={() => router.push('/stock' as any)}>
          <Text style={styles.seeAllText}>Voir tout</Text>
        </TouchableOpacity>
      </View>

      {recentMovements.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>Aucun mouvement de stock enregistré</Text>
        </View>
      ) : (
        recentMovements.map((movement) => (
          <StockCard key={movement.id} movement={movement} />
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  userBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  greeting: {
    fontSize: 13,
    color: theme.colors.textMuted,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.text,
  },
  logoutBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
  },
  logoutText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.danger,
  },
  kpiGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderLeftWidth: 4,
  },
  kpiLabel: {
    fontSize: 11,
    color: theme.colors.textMuted,
    fontWeight: '600',
    marginBottom: 4,
  },
  kpiValue: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.text,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  actionBtn: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  emptyCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  emptyText: {
    color: theme.colors.textMuted,
    fontSize: 14,
  },
});
