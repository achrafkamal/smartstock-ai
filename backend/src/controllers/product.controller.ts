import { Request, Response, NextFunction } from 'express';
import { Product } from '../models/Product.js';

export async function getProducts(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const products = await Product.findAll({ order: [['name', 'ASC']] });
    res.json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
}

export async function getProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    const product = await Product.findByPk(id);

    if (!product) {
      res.status(404).json({ success: false, error: 'Product not found' });
      return;
    }

    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
}

export async function createProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name, description, price, costPrice, quantity, lowStockThreshold } = req.body;

    if (!name || price === undefined || costPrice === undefined) {
      res.status(400).json({ success: false, error: 'Name, price, and costPrice are required' });
      return;
    }

    const product = await Product.create({
      name,
      description: description || null,
      price: Number(price),
      costPrice: Number(costPrice),
      quantity: quantity !== undefined ? Number(quantity) : 0,
      lowStockThreshold: lowStockThreshold !== undefined ? Number(lowStockThreshold) : 5,
    });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
}

export async function updateProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    const product = await Product.findByPk(id);

    if (!product) {
      res.status(404).json({ success: false, error: 'Product not found' });
      return;
    }

    const { name, description, price, costPrice, quantity, lowStockThreshold } = req.body;

    await product.update({
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(price !== undefined && { price: Number(price) }),
      ...(costPrice !== undefined && { costPrice: Number(costPrice) }),
      ...(quantity !== undefined && { quantity: Number(quantity) }),
      ...(lowStockThreshold !== undefined && { lowStockThreshold: Number(lowStockThreshold) }),
    });

    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
}

export async function deleteProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    const product = await Product.findByPk(id);

    if (!product) {
      res.status(404).json({ success: false, error: 'Product not found' });
      return;
    }

    await product.destroy();
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
}
