import { Router } from "express";
import { runAsyncWrapper } from '../utils/wrapper.js';
import { getAll, getById, createTransaction } from '../repository/transactions.js';


const router = Router();


router.get('/', runAsyncWrapper(async (req, res)  => {
    const { type } = req.query;

    if (!type || type === '') {
        res.json(getAll())
    } else {
        res.json(getAll([type]))
    }
}));


router.post('/', runAsyncWrapper(async (req, res) => {
    try {
        await createTransaction(req.body);
    } catch (e) {
        res.status(500).send(e)
    }

    res.status(201).end();
}));


router.get('/:id', runAsyncWrapper(async (req, res)  => {
    const transaction = await getById(req.params.id);

    if (transaction) {
        res.json(transaction)
    } else {
        res.status(404).json({
            'message': 'Transacción no encontrada'
        })
    }
}));


export default router;
