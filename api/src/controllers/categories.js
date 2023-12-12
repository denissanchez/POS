import { Router } from "express";
import { runAsyncWrapper } from '../utils/wrapper.js';
import { getAll } from '../repository/categories.js';


const router = Router();


router.use(function(req, res, next) {
    next();
});


router.get('/', runAsyncWrapper(async (req, res)  => {
    const categories = await getAll();
    res.json(categories)
}));


export default router;
