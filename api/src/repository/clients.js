import { getConnection } from "./db.js";


export function getAll() {
    const db = getConnection();
    return db.data.clients;
}


export function getById(_id) {
    const db = getConnection();
    return db.data.clients.find(x => x._id === _id);
}


export async function create(payload) {
    const client = getById(payload._id);

    if (!/^\d{8,11}$/.test(payload._id)) {
        return;
    }

    if (client) {
        await update(payload._id, payload)
        return;
    }

    const db = getConnection();
    db.data.clients.push(payload);
    await db.write();
}

export async function update(_id, payload) {
    const db = getConnection();
    const index = db.data.clients.findIndex(x => x._id === _id);

    console.log(index)
    db.data.clients[index] = payload;
    await db.write();
}
