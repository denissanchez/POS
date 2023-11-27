import { getConnection } from './db.js';
import { v4 } from 'uuid';


export function getAll(start, end, types=["CREDITO", "COBRADO", "COTIZACION"]) {
    const db = getConnection();
    return db.data.transactions.filter(x => types.includes(x.type))
}


export async function createTransaction(payload) {
    const db = getConnection();

    db.data.transactions.push({
        _id: v4(),
        ...payload
    });

    await db.write();
}


export async function getById(_id) {
    const db = getConnection();

    return db.data.transactions.find(t => t._id === _id)
}
