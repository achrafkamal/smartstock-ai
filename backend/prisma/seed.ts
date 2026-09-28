import { PrismaClient, MovementType, PaymentMethod, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding for SmartStock AI (Ma7alkom)...');

  // 1. Clean existing records in correct relation order (if any)
  await prisma.saleItem.deleteMany();
  await prisma.sale.deleteMany();
  await prisma.stockMovement.deleteMany();
  await prisma.product.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleaned existing records.');

  // 2. Create Default Shop Manager User
  const managerUser = await prisma.user.create({
    data: {
      name: 'Youssef El Amrani',
      email: 'manager@smartstock.ma',
      password: '$2a$10$wW5g7XG8m.J8L2gNqJqE.e8eKqQZ0f0vV6b/fBqHj1K6vB8bWf6yC', // bcrypt hash for 'SmartStock2026!'
      role: UserRole.MANAGER,
    },
  });
  console.log(`👤 Created manager user: ${managerUser.email}`);

  // 3. Create Moroccan Suppliers
  const suppliers = await Promise.all([
    prisma.supplier.create({
      data: {
        name: 'Centrale Danone Maroc',
        phone: '+212 522 958 100',
        email: 'commandes@centraledanone.ma',
        address: 'Boulevard Moulay Ismail, Roches Noires, Casablanca',
      },
    }),
    prisma.supplier.create({
      data: {
        name: 'Société des Boissons du Maroc (SBM)',
        phone: '+212 522 679 000',
        email: 'distribution@boissons-maroc.ma',
        address: 'Zone Industrielle Tit Mellil, Casablanca',
      },
    }),
    prisma.supplier.create({
      data: {
        name: 'Lesieur Cristal',
        phone: '+212 522 678 100',
        email: 'commercial@lesieur-cristal.co.ma',
        address: '1 Rue Caporal Corbi, Ain Borja, Casablanca',
      },
    }),
    prisma.supplier.create({
      data: {
        name: 'Cosumar Distribution',
        phone: '+212 522 242 424',
        email: 'contact@cosumar.co.ma',
        address: '8 Rue El Mouatamid Ibn Abbad, Casablanca',
      },
    }),
    prisma.supplier.create({
      data: {
        name: 'Dislog Group (Procter & Gamble / Mondelēz)',
        phone: '+212 522 639 500',
        email: 'logistique@dislog.ma',
        address: 'Parc Industriel Sapino, Nouaceur',
      },
    }),
  ]);

  const [danone, sbm, lesieur, cosumar, dislog] = suppliers;
  console.log(`🏢 Created ${suppliers.length} Moroccan suppliers.`);

  // 4. Create Categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Boissons',
        description: 'Eaux minérales, sodas, jus de fruits et boissons gazeuses',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Épicerie',
        description: 'Huiles, farines, sucres, thés, cafés, épices et pâtes',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Produits laitiers',
        description: 'Laits, yaourts, fromages, beurres et crèmes',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Snacks & Biscuits',
        description: 'Biscuits marocains, chocolats, gaufrettes et chips',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Hygiène & Entretien',
        description: 'Savons, dentifrices, détergents et soins personnels',
      },
    }),
  ]);

  const [catBoissons, catEpicerie, catLaitiers, catSnacks, catHygiene] = categories;
  console.log(`📂 Created ${categories.length} product categories.`);

  // 5. Seed Products with realistic MAD prices, barcodes, stock and thresholds
  const rawProducts = [
    // Boissons
    {
      name: 'Coca-Cola Canette 330ml',
      sku: 'BOIS-COCA-330',
      barcode: '5449000000996',
      description: 'Soda gazeux rafraîchissant Coca-Cola classique en canette',
      imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=80',
      purchasePrice: 4.50,
      sellingPrice: 6.00,
      currentStock: 48,
      minStockThreshold: 12,
      categoryId: catBoissons.id,
      supplierId: sbm.id,
    },
    {
      name: 'Eau Minérale Sidi Ali 1.5L',
      sku: 'BOIS-SIDI-15L',
      barcode: '6111036000018',
      description: 'Eau minérale naturelle marocaine pure de la source Oulmès',
      imageUrl: 'https://images.unsplash.com/photo-1559839914-17aae19cec71?w=500&auto=format&fit=crop&q=80',
      purchasePrice: 4.20,
      sellingPrice: 6.00,
      currentStock: 60,
      minStockThreshold: 15,
      categoryId: catBoissons.id,
      supplierId: sbm.id,
    },
    {
      name: 'Jus d’Orange Marrakech 1L',
      sku: 'BOIS-MKCH-1L',
      barcode: '6111078000123',
      description: 'Pur jus d’oranges du Maroc sans sucres ajoutés',
      imageUrl: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500&auto=format&fit=crop&q=80',
      purchasePrice: 10.00,
      sellingPrice: 13.50,
      currentStock: 3, // LOW STOCK for demo
      minStockThreshold: 8,
      categoryId: catBoissons.id,
      supplierId: sbm.id,
    },
    {
      name: 'Eau Gazeuse Oulmès 1L',
      sku: 'BOIS-OULM-1L',
      barcode: '6111036000056',
      description: 'Eau minérale naturelle gazeuse marocaine Oulmès',
      imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&auto=format&fit=crop&q=80',
      purchasePrice: 5.00,
      sellingPrice: 7.00,
      currentStock: 24,
      minStockThreshold: 6,
      categoryId: catBoissons.id,
      supplierId: sbm.id,
    },

    // Produits Laitiers
    {
      name: 'Lait Demi-Écrémé Jaouda 1L (UHT)',
      sku: 'LAIT-JAOU-1L',
      barcode: '6111042000035',
      description: 'Lait pasteurisé demi-écrémé brique Jaouda',
      imageUrl: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&auto=format&fit=crop&q=80',
      purchasePrice: 8.80,
      sellingPrice: 10.50,
      currentStock: 28,
      minStockThreshold: 10,
      categoryId: catLaitiers.id,
      supplierId: danone.id,
    },
    {
      name: 'Fromage Fondu La Vache Qui Rit 16 Portions',
      sku: 'LAIT-VQRT-16P',
      barcode: '3073780965324',
      description: 'Boîte ronde de 16 portions triangulaires de fromage fondu crémeux',
      imageUrl: 'https://images.unsplash.com/photo-1624806992066-5ffcf7ca186b?w=500&auto=format&fit=crop&q=80',
      purchasePrice: 14.50,
      sellingPrice: 18.00,
      currentStock: 32,
      minStockThreshold: 8,
      categoryId: catLaitiers.id,
      supplierId: danone.id,
    },
    {
      name: 'Yaourt Brassé Danone Moufid Vanille 110g',
      sku: 'LAIT-DAN-VAN',
      barcode: '6111014000122',
      description: 'Yaourt aromatisé à la vanille Danone',
      imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&auto=format&fit=crop&q=80',
      purchasePrice: 1.80,
      sellingPrice: 2.50,
      currentStock: 40,
      minStockThreshold: 12,
      categoryId: catLaitiers.id,
      supplierId: danone.id,
    },

    // Épicerie
    {
      name: 'Huile de Table Lesieur 1L',
      sku: 'EPIC-LESI-1L',
      barcode: '6111005000010',
      description: 'Huile de graines 100% pure pour friture et assaisonnement',
      imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=80',
      purchasePrice: 18.00,
      sellingPrice: 22.00,
      currentStock: 22,
      minStockThreshold: 6,
      categoryId: catEpicerie.id,
      supplierId: lesieur.id,
    },
    {
      name: 'Farine Fleur MayMouna 5kg',
      sku: 'EPIC-MAYM-5KG',
      barcode: '6111066000055',
      description: 'Farine de blé tendre extra fine qualité supérieure pour pâtisserie et pain',
      imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80',
      purchasePrice: 24.50,
      sellingPrice: 29.00,
      currentStock: 16,
      minStockThreshold: 5,
      categoryId: catEpicerie.id,
      supplierId: cosumar.id,
    },
    {
      name: 'Sucre En Morceaux Enmer 1kg (Lqaleb)',
      sku: 'EPIC-ENMR-1KG',
      barcode: '6111018000029',
      description: 'Sucre blanc traditionnel en morceaux pour thé à la menthe',
      imageUrl: 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=500&auto=format&fit=crop&q=80',
      purchasePrice: 4.80,
      sellingPrice: 6.00,
      currentStock: 4, // LOW STOCK for demo
      minStockThreshold: 10,
      categoryId: catEpicerie.id,
      supplierId: cosumar.id,
    },
    {
      name: 'Thé Vert Al Bared Chnani 200g',
      sku: 'EPIC-BARD-200G',
      barcode: '6111059000031',
      description: 'Thé vert chinois de haute qualité sélectionné pour le thé marocain',
      imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=80',
      purchasePrice: 11.50,
      sellingPrice: 14.50,
      currentStock: 35,
      minStockThreshold: 8,
      categoryId: catEpicerie.id,
      supplierId: cosumar.id,
    },
    {
      name: 'Café Moulu Samar 250g',
      sku: 'EPIC-SAMR-250G',
      barcode: '6111029000047',
      description: 'Café moulu torréfié arôme riche et intense',
      imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&auto=format&fit=crop&q=80',
      purchasePrice: 16.00,
      sellingPrice: 20.00,
      currentStock: 18,
      minStockThreshold: 5,
      categoryId: catEpicerie.id,
      supplierId: cosumar.id,
    },
    {
      name: 'Couscous Dari Fin 1kg',
      sku: 'EPIC-DARI-1KG',
      barcode: '6111032000015',
      description: 'Couscous moyen de semoule de blé dur de tradition marocaine',
      imageUrl: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=500&auto=format&fit=crop&q=80',
      purchasePrice: 12.00,
      sellingPrice: 15.00,
      currentStock: 25,
      minStockThreshold: 6,
      categoryId: catEpicerie.id,
      supplierId: lesieur.id,
    },

    // Snacks & Biscuits
    {
      name: 'Biscuits Merendina Chocolat Génoise',
      sku: 'SNCK-MRND-CHO',
      barcode: '6111038000012',
      description: 'La célèbre génoise marocaine enrobée de délicieux chocolat',
      imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&auto=format&fit=crop&q=80',
      purchasePrice: 1.80,
      sellingPrice: 2.50,
      currentStock: 72,
      minStockThreshold: 20,
      categoryId: catSnacks.id,
      supplierId: dislog.id,
    },
    {
      name: 'Biscuits Henry’s Original 42g',
      sku: 'SNCK-HNRY-42G',
      barcode: '6111038000050',
      description: 'Biscuit sec traditionnel marocain croustillant',
      imageUrl: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=500&auto=format&fit=crop&q=80',
      purchasePrice: 1.50,
      sellingPrice: 2.00,
      currentStock: 80,
      minStockThreshold: 24,
      categoryId: catSnacks.id,
      supplierId: dislog.id,
    },
    {
      name: 'Chocolat Maruja Noisettes 100g',
      sku: 'SNCK-MRJA-100G',
      barcode: '8410214002345',
      description: 'Tablette de chocolat au lait avec éclats de noisettes croquantes',
      imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500&auto=format&fit=crop&q=80',
      purchasePrice: 7.00,
      sellingPrice: 9.50,
      currentStock: 30,
      minStockThreshold: 8,
      categoryId: catSnacks.id,
      supplierId: dislog.id,
    },

    // Hygiène & Entretien
    {
      name: 'Savon Taous Naturel 125g',
      sku: 'HYG-TAOS-125G',
      barcode: '6111005000096',
      description: 'Savon de toilette authentique Taous à l’huile d’olive pure',
      imageUrl: 'https://images.unsplash.com/photo-1607006311600-33471450268f?w=500&auto=format&fit=crop&q=80',
      purchasePrice: 4.00,
      sellingPrice: 5.50,
      currentStock: 36,
      minStockThreshold: 10,
      categoryId: catHygiene.id,
      supplierId: lesieur.id,
    },
    {
      name: 'Dentifrice Signal Anti-Carie 75ml',
      sku: 'HYG-SIGN-75ML',
      barcode: '8712561338875',
      description: 'Dentifrice au fluor et calcium actif pour protection intégrale',
      imageUrl: 'https://images.unsplash.com/photo-1559591937-e1069695629c?w=500&auto=format&fit=crop&q=80',
      purchasePrice: 9.50,
      sellingPrice: 13.00,
      currentStock: 14,
      minStockThreshold: 5,
      categoryId: catHygiene.id,
      supplierId: dislog.id,
    },
    {
      name: 'Détergent Liquide Omo Active 1L',
      sku: 'HYG-OMO-1L',
      barcode: '8712561559980',
      description: 'Lessive liquide concentrée élimination impeccable des taches',
      imageUrl: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=500&auto=format&fit=crop&q=80',
      purchasePrice: 22.00,
      sellingPrice: 28.00,
      currentStock: 15,
      minStockThreshold: 4,
      categoryId: catHygiene.id,
      supplierId: dislog.id,
    },
  ];

  const createdProducts = [];
  for (const item of rawProducts) {
    const product = await prisma.product.create({
      data: item,
    });
    createdProducts.push(product);

    // Initial stock entry movement for audit trail
    await prisma.stockMovement.create({
      data: {
        productId: product.id,
        type: MovementType.ENTRY,
        quantity: product.currentStock + 5, // started with slightly more before initial sales
        reason: 'Inventaire initial magasin / Réception fournisseur',
        reference: `INIT-${product.sku}`,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
      },
    });
  }

  console.log(`📦 Created ${createdProducts.length} retail products with stock audit entries.`);

  // 6. Create realistic past & today Sales to demonstrate analytics & POS history
  const coca = createdProducts.find((p) => p.sku === 'BOIS-COCA-330')!;
  const sidiAli = createdProducts.find((p) => p.sku === 'BOIS-SIDI-15L')!;
  const merendina = createdProducts.find((p) => p.sku === 'SNCK-MRND-CHO')!;
  const vqr = createdProducts.find((p) => p.sku === 'LAIT-VQRT-16P')!;
  const jaouda = createdProducts.find((p) => p.sku === 'LAIT-JAOU-1L')!;

  // Sale 1: Completed earlier today
  const sale1Total = 2 * 6.00 + 1 * 6.00; // 2 Coca + 1 Sidi Ali = 18.00 MAD
  const sale1Profit = 2 * (6.00 - 4.50) + 1 * (6.00 - 4.20); // 3.00 + 1.80 = 4.80 MAD
  const sale1 = await prisma.sale.create({
    data: {
      receiptNumber: `REC-${Date.now().toString().slice(-6)}-01`,
      totalAmount: sale1Total,
      totalProfit: sale1Profit,
      paymentMethod: PaymentMethod.CASH,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
      items: {
        create: [
          {
            productId: coca.id,
            quantity: 2,
            unitPrice: 6.00,
            unitCost: 4.50,
            subtotal: 12.00,
            profit: 3.00,
          },
          {
            productId: sidiAli.id,
            quantity: 1,
            unitPrice: 6.00,
            unitCost: 4.20,
            subtotal: 6.00,
            profit: 1.80,
          },
        ],
      },
    },
  });

  // Stock movement for Sale 1
  await prisma.stockMovement.createMany({
    data: [
      {
        productId: coca.id,
        type: MovementType.EXIT,
        quantity: 2,
        reason: 'Vente au comptoir POS',
        reference: sale1.receiptNumber,
        createdAt: sale1.createdAt,
      },
      {
        productId: sidiAli.id,
        type: MovementType.EXIT,
        quantity: 1,
        reason: 'Vente au comptoir POS',
        reference: sale1.receiptNumber,
        createdAt: sale1.createdAt,
      },
    ],
  });

  // Sale 2: Family grocery sale today
  const sale2Total = 1 * 18.00 + 2 * 10.50 + 3 * 2.50; // 18 + 21 + 7.50 = 46.50 MAD
  const sale2Profit = 1 * (18.00 - 14.50) + 2 * (10.50 - 8.80) + 3 * (2.50 - 1.80); // 3.50 + 3.40 + 2.10 = 9.00 MAD
  const sale2 = await prisma.sale.create({
    data: {
      receiptNumber: `REC-${Date.now().toString().slice(-6)}-02`,
      totalAmount: sale2Total,
      totalProfit: sale2Profit,
      paymentMethod: PaymentMethod.CASH,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1), // 1 hour ago
      items: {
        create: [
          {
            productId: vqr.id,
            quantity: 1,
            unitPrice: 18.00,
            unitCost: 14.50,
            subtotal: 18.00,
            profit: 3.50,
          },
          {
            productId: jaouda.id,
            quantity: 2,
            unitPrice: 10.50,
            unitCost: 8.80,
            subtotal: 21.00,
            profit: 3.40,
          },
          {
            productId: merendina.id,
            quantity: 3,
            unitPrice: 2.50,
            unitCost: 1.80,
            subtotal: 7.50,
            profit: 2.10,
          },
        ],
      },
    },
  });

  // Stock movement for Sale 2
  await prisma.stockMovement.createMany({
    data: [
      {
        productId: vqr.id,
        type: MovementType.EXIT,
        quantity: 1,
        reason: 'Vente au comptoir POS',
        reference: sale2.receiptNumber,
        createdAt: sale2.createdAt,
      },
      {
        productId: jaouda.id,
        type: MovementType.EXIT,
        quantity: 2,
        reason: 'Vente au comptoir POS',
        reference: sale2.receiptNumber,
        createdAt: sale2.createdAt,
      },
      {
        productId: merendina.id,
        type: MovementType.EXIT,
        quantity: 3,
        reason: 'Vente au comptoir POS',
        reference: sale2.receiptNumber,
        createdAt: sale2.createdAt,
      },
    ],
  });

  console.log(`🧾 Created 2 realistic seed sales with items & exit stock movements.`);
  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
