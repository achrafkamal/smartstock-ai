import { Router } from 'express';
import { getStockMovements, createStockMovement } from '../controllers/stock.controller.js';

export const stockRouter = Router();

stockRouter.get('/', getStockMovements);
stockRouter.post('/', createStockMovement);

export default stockRouter;
