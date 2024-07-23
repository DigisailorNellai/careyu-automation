import express, { Application } from 'express';
import errorMiddleware from './middleware/error';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/user'
import customerRoutes from './routes/customer'
import products from './routes/products'

const app: Application = express();

app.use(express.json());
app.use(cookieParser());

app.use('/user', userRoutes);
app.use('/customer',customerRoutes)
app.use('/products',products)

app.use(errorMiddleware);

export default app;
    