import express, { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { env, clientOrigins } from './config/env';
import apiRoutes from './routes';
import { notFoundHandler } from './common/middleware/notFound';
import { errorHandler } from './common/middleware/errorHandler';

export function createApp(): Express {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: clientOrigins, credentials: true }));
  app.use(cookieParser());
  app.use(express.json({ limit: '2mb' }));
  app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));

  app.get('/health', (_req, res) => {
    res.json({ success: true, data: { status: 'ok' } });
  });

  app.use('/api/v1', apiRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
