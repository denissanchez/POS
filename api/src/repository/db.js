import { Low } from 'lowdb';
import { JSONPreset } from 'lowdb/node';


const db = new Low(new JSONPreset('db.json', {
    transaction: [],
    products: [],
    clients: [],
}));


export default db;
