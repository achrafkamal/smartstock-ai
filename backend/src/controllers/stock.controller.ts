import { Request, Response, NextFunction } from 'express';
import { StockMovement } from '../models/StockMovement.js';
import { Product } from '../models/Product.js';
import { User } from '../models/User.js';

export async function getStockMovements(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const movements = await StockMovement.findAll({
      include: [
        { model: Product, as: 'product' },
        { model: User, as: 'user', attributes: ['id', 'name', 'email', 'role'] },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json({ success: true, data: movements });
  } catch (error) {
    next(error);
  }
}

export async function createStockMovement(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { productId, type, quantity, reason, userId } = req.body;

    if (!productId || !type || quantity === undefined) {
      res.status(400).json({ success: false, error: 'productId, type, and quantity are required' });
      return;
    }

    const qty = Number(quantity);
    if (qty <= 0) {
      res.status(400).json({ success: false, error: 'Quantity must be greater than 0' });
      return;
    }

    const product = await Product.findByPk(productId);
    if (!product) {
      res.status(404).json({ success: false, error: 'Product not found' });
      return;
    }

    let updatedQuantity = product.quantity;

    if (type === 'ENTRY') {
      updatedQuantity += qty;
    } else if (type === 'EXIT' || type === 'DAMAGED') {
      if (product.quantity < qty) {
        res.status(400).json({ success: false, error: 'Insufficient stock for this movement' });
        return;
      }
      updatedQuantity -= qty;
    } else if (type === 'ADJUSTMENT') {
      updatedQuantity = qty;
    } else {
      res.status(400).json({ success: false, error: 'Invalid movement type' });
      return;
    }

    // Update product stock quantity
    await product.update({ quantity: updatedQuantity });

    // Record the movement
    const movement = await StockMovement.create({
      productId,
      type,
      quantity: qty,
      reason: reason || null,
      userId: userId || req.user?.userId || null,
    });

    const fullMovement = await StockMovement.findByPk(movement.id, {
      include: [
        { model: Product, as: 'product' },
        { model: User, as: 'user', attributes: ['id', 'name', 'email', 'role'] },
      ],
    });

    res.status(201).json({
      success: true,
      data: {
        movement: fullMovement || movement,
        currentStock: updatedQuantity,
      },
    });
  } catch (error) {
    next(error);
  }
}
