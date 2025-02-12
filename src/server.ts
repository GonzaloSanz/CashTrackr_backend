import express from 'express';
import colors from 'colors';
import morgan from 'morgan';
import { db } from './config/db';
import budgetRouter from './routes/budgetRouter';
import authRouter from './routes/authRouter';

const app = express();

async function connectDB() {
    try {
        await db.authenticate();
        db.sync();
        console.log(colors.magenta.bold('Conexión exitosa a la base de datos'));

    } catch (error) {
        // console.log(error);
        console.log(colors.red.bold('Fallo en la conexión a la base de datos'));
    }
}
connectDB();

app.use(morgan('dev'));

app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/budgets', budgetRouter);

export default app;