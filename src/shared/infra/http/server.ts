import 'reflect-metadata';
import 'dotenv/config';

import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import cors from 'cors';
import { errors } from 'celebrate';

import UploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError'; // '@shared/errors/AppError'; // errors/AppError';
import 'shared/container';
import routes from './routes';
import '../typeorm';
import 'moment/locale/pt-br';

const app = express();
app.use(cors());

app.use(express.json());
app.use('/files', express.static(UploadConfig.pathUploads));
app.use(routes);

app.use(errors());

app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        status: 'error',
        message: err.message,
      });
    }
    console.log(err);
    return response.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  },
);

app.listen(3333, () => {
  console.log('👀 Server started port 3333');
});
