import { getAdapter } from './excel.js';
import { getConnection } from './db.js';
import { v4 } from 'uuid';
import { create as createClient } from './clients.js';


export function getAll(from, to, types=["CREDITO", "COBRADO", "COTIZACION"]) {
    const db = getConnection();
    const fromDate = new Date(from);
    const toDate = new Date(to);

    return db.data.transactions
        .filter(x => types.includes(x.type))
        .filter(x => {
            const createdAt = new Date(x.createdAt);
            return createdAt >= fromDate && createdAt <= toDate;
        });
}


export async function createTransaction(payload) {
    const adapter = getAdapter();
    const db = getConnection();

    db.data.transactions.push({
        _id: v4(),
        ...payload
    });

    await db.write();

    if (payload.type == "COTIZACION") {
        return;
    }

    if (payload.client._id.trim() !== "") {
        await createClient(payload.client);
    }

    await adapter.updateStock(payload.items);
    await adapter.registerTransaction(payload.type, payload.items, payload.client.name);
}


export async function getById(_id) {
    const db = getConnection();

    return db.data.transactions.find(t => t._id === _id)
}
