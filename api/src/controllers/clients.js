import { Router } from "express";
import { runAsyncWrapper } from '../utils/wrapper.js';
import { getAll, getById } from '../repository/clients.js';


const router = Router();


router.use(function(req, res, next) {
    next();
});


router.get('/', runAsyncWrapper(async (req, res)  => {
    res.json(getAll())
}));


router.get('/:id', runAsyncWrapper(async (req, res)  => {
    const client = await getById(req.params.id);

    if (client) {
        res.json(client)
    } else {
        res.status(404).json({
            'message': 'Cliente no encontrado'
        })
    }
}));


export default router;
