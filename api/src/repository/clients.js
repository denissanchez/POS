import { getConnection } from "./db.js";


export function getAll() {
    const db = getConnection();
    return db.data.clients;
}


export function getById(_id) {
    const db = getConnection();
    return db.data.clients.find(x => x._id === _id);
}
