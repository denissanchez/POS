import { Router } from "express";
import { runAsyncWrapper } from '../utils/wrapper.js';
import { getAll, getById, search } from '../repository/products.js';


const router = Router();


router.use(function(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});


router.get('/', runAsyncWrapper(async(req, res)  => {
    const { q } = req.query;

    if (!!q && q.trim() !== '') {
        const filtered = await search(q.trim());
        res.json(filtered);
    } else { 
        const products = await getAll();
        res.json(products)
    }
}));


router.get('/:id', runAsyncWrapper(async(req, res) => {
    const product = await getById(req.params.id);

    if (product) {
        res.json(product)
    } else {
        res.status(404).json({
            'message': 'Producto no encontrado'
        })
    }
}))


export default router;
