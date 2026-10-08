import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database.js';

export interface ProductAttributes {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  costPrice: number;
  quantity: number;
  lowStockThreshold: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ProductCreationAttributes = Optional<
  ProductAttributes,
  'id' | 'description' | 'quantity' | 'lowStockThreshold' | 'createdAt' | 'updatedAt'
>;

export class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
  declare id: string;
  declare name: string;
  declare description: string | null;
  declare price: number;
  declare costPrice: number;
  declare quantity: number;
  declare lowStockThreshold: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Product.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      get() {
        const raw = this.getDataValue('price');
        return raw !== null && raw !== undefined ? parseFloat(raw as any) : 0;
      },
    },
    costPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      get() {
        const raw = this.getDataValue('costPrice');
        return raw !== null && raw !== undefined ? parseFloat(raw as any) : 0;
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    lowStockThreshold: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 5,
    },
  },
  {
    sequelize,
    tableName: 'products',
  }
);

export default Product;
