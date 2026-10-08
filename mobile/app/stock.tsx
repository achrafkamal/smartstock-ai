import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { useStockStore, MovementType } from '../store/stockStore';
import { useProductStore } from '../store/productStore';
import { theme } from '../constants/theme';
import { StockCard } from '../components/StockCard';
import { AppInput } from '../components/AppInput';
import { AppButton } from '../components/AppButton';

export default function StockScreen() {
  const { movements, fetchMovements, createMovement, loading } = useStockStore();
  const { products, fetchProducts } = useProductStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [movementType, setMovementType] = useState<MovementType>('ENTRY');
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    fetchMovements();
    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0 && !selectedProductId) {
      setSelectedProductId(products[0].id);
    }
  }, [products, selectedProductId]);

  const handleOpenModal = () => {
    if (products.length > 0 && (!selectedProductId || !products.some((p) => p.id === selectedProductId))) {
      setSelectedProductId(products[0].id);
    }
    setFormError(null);
    setModalVisible(true);
  };

  const handleCreateMovement = async () => {
    setFormError(null);

    if (products.length === 0) {
      setFormError('Aucun produit disponible. Veuillez d\'abord créer un produit.');
      return;
    }

    if (!selectedProductId) {
      setFormError('Veuillez sélectionner un produit');
      return;
    }

    const qty = parseInt(quantity.trim(), 10);
    if (!quantity.trim() || isNaN(qty) || qty <= 0) {
      setFormError('La quantité doit être un nombre entier supérieur à 0');
      return;
    }

    const currentProduct = products.find((p) => p.id === selectedProductId);
    if (currentProduct && (movementType === 'EXIT' || movementType === 'DAMAGED') && currentProduct.quantity < qty) {
      setFormError(`Stock insuffisant (${currentProduct.quantity} disponibles pour ${qty} demandés)`);
      return;
    }

    const success = await createMovement({
      productId: selectedProductId,
      type: movementType,
      quantity: qty,
      reason: reason.trim() || undefined,
    });

    if (success) {
      setQuantity('');
      setReason('');
      setModalVisible(false);
      // Refresh products so updated quantities are synced
      await fetchProducts();
    }
  };

  const typeButtons: { type: MovementType; label: string; color: string }[] = [
    { type: 'ENTRY', label: 'Entrée (+)', color: theme.colors.success },
    { type: 'EXIT', label: 'Sortie (-)', color: theme.colors.danger },
    { type: 'ADJUSTMENT', label: 'Ajustement (=)', color: theme.colors.info },
    { type: 'DAMAGED', label: 'Endommagé (-)', color: theme.colors.warning },
  ];

  return (
    <View style={styles.container}>
      {/* Top Header Bar */}
      <View style={styles.topBar}>
        <Text style={styles.headerSubtitle}>
          {movements.length} mouvements enregistrés
        </Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={handleOpenModal}
          activeOpacity={0.8}
        >
          <Text style={styles.addBtnText}>+ Mouvement</Text>
        </TouchableOpacity>
      </View>

      {/* Movements List */}
      <FlatList
        data={movements}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <StockCard movement={item} />}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => {
              fetchMovements();
              fetchProducts();
            }}
            colors={[theme.colors.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucun mouvement de stock pour le moment</Text>
          </View>
        }
      />

      {/* Create Movement Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nouveau Mouvement de Stock</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>

            {formError ? (
              <View style={styles.modalError}>
                <Text style={styles.modalErrorText}>{formError}</Text>
              </View>
            ) : null}

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Product Selector */}
              <Text style={styles.inputLabel}>Sélectionner un Produit *</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.productPickerScroll}
              >
                {products.length === 0 ? (
                  <Text style={styles.noProductsText}>
                    Aucun produit créé. Allez dans Catalogue pour en ajouter.
                  </Text>
                ) : (
                  products.map((p) => {
                    const isSelected = p.id === selectedProductId;
                    return (
                      <TouchableOpacity
                        key={p.id}
                        style={[
                          styles.productChip,
                          isSelected && styles.productChipActive,
                        ]}
                        onPress={() => setSelectedProductId(p.id)}
                      >
                        <Text
                          style={[
                            styles.productChipText,
                            isSelected && styles.productChipTextActive,
                          ]}
                        >
                          {p.name} ({p.quantity})
                        </Text>
                      </TouchableOpacity>
                    );
                  })
                )}
              </ScrollView>

              {/* Movement Type Selector */}
              <Text style={styles.inputLabel}>Type de Mouvement *</Text>
              <View style={styles.typeGrid}>
                {typeButtons.map((btn) => {
                  const isSelected = movementType === btn.type;
                  return (
                    <TouchableOpacity
                      key={btn.type}
                      style={[
                        styles.typeBtn,
                        isSelected && {
                          backgroundColor: btn.color,
                          borderColor: btn.color,
                        },
                      ]}
                      onPress={() => setMovementType(btn.type)}
                    >
                      <Text
                        style={[
                          styles.typeBtnText,
                          isSelected && styles.typeBtnTextActive,
                        ]}
                      >
                        {btn.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Quantity Input */}
              <AppInput
                label="Quantité *"
                placeholder="Ex: 10"
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="number-pad"
              />

              {/* Reason Input */}
              <AppInput
                label="Motif / Justification"
                placeholder="Ex: Réception livraison ou Vente magasin"
                value={reason}
                onChangeText={setReason}
              />

              <AppButton
                title="Valider le mouvement"
                onPress={handleCreateMovement}
                loading={loading}
                style={styles.submitBtn}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  headerSubtitle: {
    fontSize: 13,
    color: theme.colors.textMuted,
    fontWeight: '600',
  },
  addBtn: {
    height: 38,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  listContent: {
    padding: theme.spacing.md,
    paddingTop: 0,
  },
  emptyContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginTop: theme.spacing.md,
  },
  emptyText: {
    color: theme.colors.textMuted,
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.text,
  },
  closeBtn: {
    fontSize: 20,
    color: theme.colors.textMuted,
    fontWeight: 'bold',
  },
  modalError: {
    backgroundColor: theme.colors.dangerLight,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.sm,
  },
  modalErrorText: {
    color: theme.colors.danger,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 6,
  },
  productPickerScroll: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  productChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginRight: theme.spacing.xs,
  },
  productChipActive: {
    backgroundColor: theme.colors.primaryLight,
    borderColor: theme.colors.primary,
  },
  productChipText: {
    fontSize: 13,
    color: theme.colors.text,
    fontWeight: '500',
  },
  productChipTextActive: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.md,
  },
  typeBtn: {
    flexBasis: '48%',
    paddingVertical: 10,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
  },
  typeBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.text,
  },
  typeBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  submitBtn: {
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.lg,
  },
  noProductsText: {
    color: theme.colors.textMuted,
    fontSize: 13,
    fontStyle: 'italic',
    paddingVertical: 8,
  },
});
