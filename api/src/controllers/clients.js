import { Router } from "express";
import { runAsyncWrapper } from '../utils/wrapper.js';


const router = Router();


router.get('/', runAsyncWrapper(async (req, res)  => {
    res.json({
        ok: true
    })
}));


export default router;
