import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = typeof err.statusCode === 'number' ? err.statusCode : 500;
  console.error(`[Error] ${statusCode} - ${err.message}`);

  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error',
  });
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.originalUrl} not found`,
  });
}
