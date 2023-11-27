import { getConnection } from "./db.js";
import { v4 } from "uuid";
import bcrypt from "bcrypt";


export function getAll() {
    const db = getConnection();
    return db.data.users;
}


export function getById(_id) {
    const db = getConnection();
    return db.data.users.find(x => x._id === _id);
}


export function create(user) {
    const db = getConnection();
    
    const hashedPassword = bcrypt.hashSync(user.password, 10);
    user.password = hashedPassword;

    db.data.users.push({ _id: v4(), ...user});
    db.write();
}


export function verifyCredentials(username, password) {
    const db = getConnection();

    const user = db.data.users.find(x => x.username === username);
    if (!user) return null;

    const isValid = bcrypt.compareSync(password, user.password);
    if (!isValid) return null;

    return user;
}