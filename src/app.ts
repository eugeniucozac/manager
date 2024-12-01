import express, { Application } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { logger } from './utils/logger';
import taskRoutes from './routes/taskRoutes';
import projectRoutes from './routes/projectRoutes';
import { errorHandler } from './utils/errorHandler';

dotenv.config();

const app: Application = express();

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });

app.use(express.json());

app.use((req, res, next) => {
  logger.info(`Request: ${req.method} ${req.url}`);
  res.on('finish', () => {
    logger.info(`Response: ${res.statusCode} - ${req.method} ${req.url}`);
  });
  next();
});

app.use('/tasks', taskRoutes);
app.use('/projects', projectRoutes);

app.use(helmet());
app.use(limiter);
app.use(errorHandler);

export default app;
