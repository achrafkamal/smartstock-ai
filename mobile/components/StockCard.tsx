import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';
import { StockMovement, MovementType } from '../store/stockStore';

interface StockCardProps {
  movement: StockMovement;
}

export const StockCard: React.FC<StockCardProps> = ({ movement }) => {
  const getMovementConfig = (type: MovementType) => {
    switch (type) {
      case 'ENTRY':
        return {
          label: 'ENTRÉE',
          sign: '+',
          bg: theme.colors.successLight,
          color: theme.colors.success,
        };
      case 'EXIT':
        return {
          label: 'SORTIE',
          sign: '-',
          bg: theme.colors.dangerLight,
          color: theme.colors.danger,
        };
      case 'ADJUSTMENT':
        return {
          label: 'AJUSTEMENT',
          sign: '=',
          bg: theme.colors.infoLight,
          color: theme.colors.info,
        };
      case 'DAMAGED':
        return {
          label: 'ENDOMMAGÉ',
          sign: '-',
          bg: theme.colors.warningLight,
          color: theme.colors.warning,
        };
      default:
        return {
          label: type,
          sign: '',
          bg: theme.colors.border,
          color: theme.colors.text,
        };
    }
  };

  const config = getMovementConfig(movement.type);
  const formattedDate = movement.createdAt
    ? new Date(movement.createdAt).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  return (
    <View style={styles.card}>
      <View style={styles.left}>
        <View style={[styles.badge, { backgroundColor: config.bg }]}>
          <Text style={[styles.badgeText, { color: config.color }]}>{config.label}</Text>
        </View>
        <View style={styles.details}>
          <Text style={styles.productName} numberOfLines={1}>
            {movement.product?.name || `Produit #${movement.productId.slice(0, 8)}`}
          </Text>
          {movement.reason ? (
            <Text style={styles.reason} numberOfLines={1}>
              {movement.reason}
            </Text>
          ) : null}
          <Text style={styles.date}>{formattedDate}</Text>
        </View>
      </View>

      <View style={styles.right}>
        <Text style={[styles.quantity, { color: config.color }]}>
          {config.sign}
          {movement.quantity}
        </Text>
      </View>
    </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: theme.borderRadius.sm,
    marginRight: theme.spacing.sm,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  details: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 2,
  },
  reason: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginBottom: 2,
  },
  date: {
    fontSize: 11,
    color: theme.colors.textMuted,
  },
  right: {
    alignItems: 'flex-end',
  },
  quantity: {
    fontSize: 17,
    fontWeight: '800',
  },
});

export default StockCard;
