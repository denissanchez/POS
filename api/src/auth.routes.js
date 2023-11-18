import { Router } from "express";
import ProductsRouter from './controllers/products.js';
import CategoriesRouter from './controllers/categories.js';
import { isAuthenticated } from './middlewares/secure.js'


const router = Router()

router.use(isAuthenticated)

router.use('/products', ProductsRouter);
router.use('/categories', CategoriesRouter);

export default router;
