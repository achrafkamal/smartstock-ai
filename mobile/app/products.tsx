import React, { useState } from 'react';
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
import { useRouter } from 'expo-router';
import { useProductsQuery, useCreateProductMutation } from '../services/products';
import { theme } from '../constants/theme';
import { SearchBar } from '../components/SearchBar';
import { ProductCard } from '../components/ProductCard';
import { AppInput } from '../components/AppInput';
import { AppButton } from '../components/AppButton';

type FilterTab = 'ALL' | 'LOW' | 'OUT';

export default function ProductsScreen() {
  const router = useRouter();
  const {
    data: products = [],
    isLoading,
    isRefetching,
    refetch: refetchProducts,
  } = useProductsQuery();
  const createProductMutation = useCreateProductMutation();

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterTab>('ALL');
  const [modalVisible, setModalVisible] = useState(false);

  // New product form fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [lowStockThreshold, setLowStockThreshold] = useState('5');
  const [formError, setFormError] = useState<string | null>(null);

  const handleCreateProduct = async () => {
    setFormError(null);
    if (!name.trim() || !price.trim() || !costPrice.trim()) {
      setFormError('Le nom, le prix et le prix de revient sont obligatoires');
      return;
    }

    const parsedPrice = parseFloat(price.replace(',', '.'));
    const parsedCostPrice = parseFloat(costPrice.replace(',', '.'));
    const parsedQty = quantity.trim() ? parseInt(quantity, 10) : 0;
    const parsedThreshold = lowStockThreshold.trim() ? parseInt(lowStockThreshold, 10) : 5;

    if (isNaN(parsedPrice) || parsedPrice < 0 || isNaN(parsedCostPrice) || parsedCostPrice < 0) {
      setFormError('Veuillez saisir des prix valides');
      return;
    }

    try {
      await createProductMutation.mutateAsync({
        name: name.trim(),
        description: description.trim() || null,
        price: parsedPrice,
        costPrice: parsedCostPrice,
        quantity: isNaN(parsedQty) ? 0 : parsedQty,
        lowStockThreshold: isNaN(parsedThreshold) ? 5 : parsedThreshold,
      });

      setName('');
      setDescription('');
      setPrice('');
      setCostPrice('');
      setQuantity('');
      setLowStockThreshold('5');
      setModalVisible(false);
    } catch (err: any) {
      setFormError(err.message || 'Erreur lors de la création du produit');
    }
  };

  // Filter & Search logic
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;

    if (filter === 'LOW') {
      return p.quantity > 0 && p.quantity <= p.lowStockThreshold;
    }
    if (filter === 'OUT') {
      return p.quantity <= 0;
    }
    return true;
  });

  return (
    <View style={styles.container}>
      {/* Top Search & Add Button */}
      <View style={styles.topBar}>
        <View style={styles.searchWrapper}>
          <SearchBar value={search} onChangeText={setSearch} />
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.addBtnText}>+ Nouveau</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, filter === 'ALL' && styles.tabActive]}
          onPress={() => setFilter('ALL')}
        >
          <Text style={[styles.tabText, filter === 'ALL' && styles.tabTextActive]}>
            Tous ({products.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, filter === 'LOW' && styles.tabActive]}
          onPress={() => setFilter('LOW')}
        >
          <Text style={[styles.tabText, filter === 'LOW' && styles.tabTextActive]}>
            Stock Faible (
            {products.filter((p) => p.quantity > 0 && p.quantity <= p.lowStockThreshold).length}
            )
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, filter === 'OUT' && styles.tabActive]}
          onPress={() => setFilter('OUT')}
        >
          <Text style={[styles.tabText, filter === 'OUT' && styles.tabTextActive]}>
            Rupture ({products.filter((p) => p.quantity <= 0).length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Products List */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => router.push(`/product/${item.id}` as any)}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching || isLoading}
            onRefresh={() => refetchProducts()}
            colors={[theme.colors.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {search
                ? `Aucun produit ne correspond à "${search}"`
                : 'Aucun produit dans le catalogue'}
            </Text>
          </View>
        }
      />

      {/* Add Product Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nouveau Produit</Text>
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
              <AppInput
                label="Nom du Produit *"
                placeholder="Ex: Coca-Cola 330ml"
                value={name}
                onChangeText={setName}
              />

              <AppInput
                label="Description"
                placeholder="Description rapide..."
                value={description}
                onChangeText={setDescription}
              />

              <View style={styles.row}>
                <View style={styles.halfInput}>
                  <AppInput
                    label="Prix Vente (MAD) *"
                    placeholder="6.00"
                    value={price}
                    onChangeText={setPrice}
                    keyboardType="decimal-pad"
                  />
                </View>
                <View style={styles.halfInput}>
                  <AppInput
                    label="Prix Achat (MAD) *"
                    placeholder="4.50"
                    value={costPrice}
                    onChangeText={setCostPrice}
                    keyboardType="decimal-pad"
                  />
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.halfInput}>
                  <AppInput
                    label="Stock Initial"
                    placeholder="0"
                    value={quantity}
                    onChangeText={setQuantity}
                    keyboardType="number-pad"
                  />
                </View>
                <View style={styles.halfInput}>
                  <AppInput
                    label="Seuil Alerte"
                    placeholder="5"
                    value={lowStockThreshold}
                    onChangeText={setLowStockThreshold}
                    keyboardType="number-pad"
                  />
                </View>
              </View>

              <AppButton
                title="Enregistrer le produit"
                onPress={handleCreateProduct}
                loading={createProductMutation.isPending}
                style={styles.saveBtn}
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
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  searchWrapper: {
    flex: 1,
  },
  addBtn: {
    height: 44,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    gap: theme.spacing.xs,
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  tabActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textMuted,
  },
  tabTextActive: {
    color: '#FFFFFF',
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
    textAlign: 'center',
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
  row: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  halfInput: {
    flex: 1,
  },
  saveBtn: {
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
});
