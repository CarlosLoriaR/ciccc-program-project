import mongoose from 'mongoose';
import { env } from './env';
import { logger } from '../common/utils/logger';

mongoose.set('strictQuery', true);

export async function connectDB(): Promise<void> {
  mongoose.connection.on('error', (err) => logger.error({ err }, 'MongoDB connection error'));
  mongoose.connection.on('disconnected', () => logger.warn('MongoDB disconnected'));

  await mongoose.connect(env.MONGODB_URI);
  logger.info('MongoDB connected');
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
}
