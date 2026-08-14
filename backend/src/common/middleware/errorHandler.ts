import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import mongoose from 'mongoose';
import { MulterError } from 'multer';
import { AppError } from '../errors/AppError';
import { logger } from '../utils/logger';
import { isProduction } from '../../config/env';

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: { message: err.message, code: err.code, details: err.details },
    });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: { message: 'Validation failed', code: 'BAD_REQUEST', details: err.flatten() },
    });
    return;
  }

  if (err instanceof mongoose.Error.CastError) {
    res.status(400).json({
      success: false,
      error: { message: `Invalid identifier: ${err.path}`, code: 'BAD_REQUEST' },
    });
    return;
  }

  if (err instanceof MulterError) {
    const message = err.code === 'LIMIT_FILE_SIZE' ? 'Image is too large (max 2MB)' : err.message;
    res.status(400).json({
      success: false,
      error: { message, code: 'BAD_REQUEST' },
    });
    return;
  }

  if (isMongoDuplicateKeyError(err)) {
    res.status(409).json({
      success: false,
      error: { message: 'Duplicate value', code: 'CONFLICT', details: err.keyValue },
    });
    return;
  }

  logger.error({ err, path: req.path }, 'Unhandled error');
  res.status(500).json({
    success: false,
    error: {
      message: isProduction ? 'Internal server error' : (err as Error)?.message || 'Internal server error',
      code: 'INTERNAL_ERROR',
    },
  });
}

function isMongoDuplicateKeyError(err: unknown): err is { code: number; keyValue: Record<string, unknown> } {
  return typeof err === 'object' && err !== null && (err as { code?: number }).code === 11000;
}
