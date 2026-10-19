import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useProductQuery } from '../../services/products';
import { theme } from '../../constants/theme';
import { AppButton } from '../../components/AppButton';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const {
    data: selectedProduct,
    isLoading,
    error,
  } = useProductQuery(id as string);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error || !selectedProduct) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          {error?.message || 'Produit introuvable'}
        </Text>
        <AppButton title="Retour" onPress={() => router.back()} style={styles.backBtn} />
      </View>
    );
  }

  const p = selectedProduct;
  const isOutOfStock = p.quantity <= 0;
  const isLowStock = !isOutOfStock && p.quantity <= p.lowStockThreshold;

  const getStatusBadge = () => {
    if (isOutOfStock) {
      return {
        label: 'Rupture de Stock',
        bg: theme.colors.dangerLight,
        color: theme.colors.danger,
      };
    }
    if (isLowStock) {
      return {
        label: 'Stock Faible (Alerte)',
        bg: theme.colors.warningLight,
        color: theme.colors.warning,
      };
    }
    return {
      label: 'En Stock (Normal)',
      bg: theme.colors.successLight,
      color: theme.colors.success,
    };
  };

  const badge = getStatusBadge();
  const sellingPrice = Number(p.price);
  const costPrice = Number(p.costPrice);
  const profitMargin = sellingPrice - costPrice;
  const marginPercent =
    costPrice > 0 ? ((profitMargin / costPrice) * 100).toFixed(1) : '0';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Product Main Card */}
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>{p.name}</Text>
          <View style={[styles.badge, { backgroundColor: badge.bg }]}>
            <Text style={[styles.badgeText, { color: badge.color }]}>{badge.label}</Text>
          </View>
        </View>

        {p.description ? (
          <Text style={styles.description}>{p.description}</Text>
        ) : null}

        <View style={styles.divider} />

        {/* Stock Info Grid */}
        <Text style={styles.sectionHeading}>État du Stock</Text>
        <View style={styles.infoRow}>
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>Quantité Actuelle</Text>
            <Text style={[styles.infoValue, { color: badge.color }]}>{p.quantity}</Text>
          </View>
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>{"Seuil d'Alerte"}</Text>
            <Text style={styles.infoValue}>{p.lowStockThreshold}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Financial Info Grid */}
        <Text style={styles.sectionHeading}>Données Financières</Text>
        <View style={styles.infoRow}>
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>Prix de Vente</Text>
            <Text style={[styles.infoValue, { color: theme.colors.primary }]}>
              {sellingPrice.toFixed(2)} MAD
            </Text>
          </View>
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>Prix de Revient</Text>
            <Text style={styles.infoValue}>{costPrice.toFixed(2)} MAD</Text>
          </View>
        </View>

        <View style={styles.marginBox}>
          <Text style={styles.marginLabel}>Marge brute estimée / unité</Text>
          <Text style={styles.marginValue}>
            +{profitMargin.toFixed(2)} MAD ({marginPercent}%)
          </Text>
        </View>
      </View>

      {/* Quick Action Button */}
      <AppButton
        title="🔄 Enregistrer Mouvement de Stock"
        onPress={() => router.push('/stock' as any)}
        style={styles.actionBtn}
      />
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
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
  },
  header: {
    marginBottom: theme.spacing.sm,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.text,
    marginBottom: 6,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  description: {
    fontSize: 14,
    color: theme.colors.textMuted,
    lineHeight: 20,
    marginTop: theme.spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: theme.spacing.md,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoCol: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.text,
  },
  marginBox: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  marginLabel: {
    fontSize: 12,
    color: theme.colors.textMuted,
    fontWeight: '600',
  },
  marginValue: {
    fontSize: 14,
    fontWeight: '800',
    color: theme.colors.success,
  },
  actionBtn: {
    marginTop: theme.spacing.xs,
  },
  errorText: {
    color: theme.colors.danger,
    fontSize: 15,
    marginBottom: theme.spacing.md,
  },
  backBtn: {
    minWidth: 120,
  },
});
