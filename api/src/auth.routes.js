import { Router } from "express";
import ProductsRouter from './controllers/products.js';
import CategoriesRouter from './controllers/categories.js';
import TransactionsRouter from './controllers/transactions.js';
import ClientsRouter from './controllers/clients.js';
import UsersRouter from './controllers/users.js';
import { isAuthenticated } from './middlewares/secure.js'


const router = Router()

router.use(isAuthenticated)

router.use('/products', ProductsRouter);
router.use('/categories', CategoriesRouter);
router.use('/transactions', TransactionsRouter);
router.use('/clients', ClientsRouter);
router.use('/users', UsersRouter);

export default router;
