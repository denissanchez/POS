import { Low } from "lowdb";
import { JSONFile } from 'lowdb/node'

let db;

export async function createConnection() {
  db = new Low(new JSONFile('db.json'), {
    transactions: [],
    clients: [],
  });

  await db.read();
  await db.write();
}

export const getConnection = () => db;
