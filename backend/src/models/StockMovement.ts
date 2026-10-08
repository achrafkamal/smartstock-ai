import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database.js';
import { User } from './User.js';
import { Product } from './Product.js';

export type MovementType = 'ENTRY' | 'EXIT' | 'ADJUSTMENT' | 'DAMAGED';

export interface StockMovementAttributes {
  id: string;
  type: MovementType;
  quantity: number;
  reason?: string | null;
  productId: string;
  userId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type StockMovementCreationAttributes = Optional<
  StockMovementAttributes,
  'id' | 'reason' | 'userId' | 'createdAt' | 'updatedAt'
>;

export class StockMovement
  extends Model<StockMovementAttributes, StockMovementCreationAttributes>
  implements StockMovementAttributes
{
  declare id: string;
  declare type: MovementType;
  declare quantity: number;
  declare reason: string | null;
  declare productId: string;
  declare userId: string | null;
  declare user?: User;
  declare product?: Product;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

StockMovement.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    type: {
      type: DataTypes.ENUM('ENTRY', 'EXIT', 'ADJUSTMENT', 'DAMAGED'),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    productId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: { model: Product, key: 'id' },
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: true,
      references: { model: User, key: 'id' },
    },
  },
  {
    sequelize,
    tableName: 'stock_movements',
  }
);

// Associations
User.hasMany(StockMovement, { foreignKey: 'userId', as: 'movements' });
StockMovement.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Product.hasMany(StockMovement, { foreignKey: 'productId', as: 'movements' });
StockMovement.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

export default StockMovement;
