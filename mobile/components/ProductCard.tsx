import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../constants/theme';
import { Product } from '../store/productStore';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  const isOutOfStock = product.quantity <= 0;
  const isLowStock = !isOutOfStock && product.quantity <= product.lowStockThreshold;

  const getStatusBadge = () => {
    if (isOutOfStock) {
      return {
        label: 'Rupture',
        bg: theme.colors.dangerLight,
        color: theme.colors.danger,
      };
    }
    if (isLowStock) {
      return {
        label: 'Stock Faible',
        bg: theme.colors.warningLight,
        color: theme.colors.warning,
      };
    }
    return {
      label: 'En Stock',
      bg: theme.colors.successLight,
      color: theme.colors.success,
    };
  };

  const badge = getStatusBadge();
  const price = Number(product.price).toFixed(2);

  return (
    <TouchableOpacity activeOpacity={0.7} style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.name} numberOfLines={1}>
          {product.name}
        </Text>
        <View style={[styles.badge, { backgroundColor: badge.bg }]}>
          <Text style={[styles.badgeText, { color: badge.color }]}>{badge.label}</Text>
        </View>
      </View>

      {product.description ? (
        <Text style={styles.description} numberOfLines={1}>
          {product.description}
        </Text>
      ) : null}

      <View style={styles.footer}>
        <View>
          <Text style={styles.priceLabel}>Prix de vente</Text>
          <Text style={styles.price}>{price} MAD</Text>
        </View>

        <View style={styles.quantityContainer}>
          <Text style={styles.quantityLabel}>Quantité</Text>
          <Text style={styles.quantity}>{product.quantity}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.borderRadius.full,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  description: {
    fontSize: 13,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: theme.spacing.xs,
    paddingTop: theme.spacing.xs,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  priceLabel: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginBottom: 2,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  quantityContainer: {
    alignItems: 'flex-end',
  },
  quantityLabel: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginBottom: 2,
  },
  quantity: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
  },
});

export default ProductCard;
