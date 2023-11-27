import { Router } from "express";
import { runAsyncWrapper } from '../utils/wrapper.js';
import { getAll, getById, createTransaction } from '../repository/transactions.js';
import { isAuthorized } from "../middlewares/authorization.js";
import { CAN_VIEW_TRANSACTIONS } from "../utils/constants.js";


const router = Router();


router.get('/', isAuthorized(CAN_VIEW_TRANSACTIONS), runAsyncWrapper(async (req, res)  => {
    const { type, start, end } = req.query;

    if (!type || type === '') {
        res.json(getAll(start, end))
    } else {
        res.json(getAll(start, end, [type]))
    }
}));


router.post('/', runAsyncWrapper(async (req, res) => {
    try {
        await createTransaction({...req.body, createdAt: new Date().toISOString()});
    } catch (e) {
        res.status(500).send(e)
    }

    res.status(201).end();
}));


router.get('/:id', isAuthorized(CAN_VIEW_TRANSACTIONS), runAsyncWrapper(async (req, res)  => {
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
