import { getConnection } from "./db.js";
import { v4 } from "uuid";
import bcrypt from "bcrypt";


export function getAll() {
    const db = getConnection();
    return db.data.users.map(x => ({ ...x, password: "********" }));
}


export function getById(_id) {
    return getAll().find(x => x._id === _id);
}


export function create(user, _id = undefined) {
    const db = getConnection();

    const exists = db.data.users.find(x => x.username === user.username);

    if (exists) {
        return [{
            "usernameAlreadyExists": true
        }, null]
    }
    
    const hashedPassword = bcrypt.hashSync(user.password, 10);
    user.password = hashedPassword;

    db.data.users.push({ _id: _id || v4(), ...user});
    db.write();

    return [null, user];
}


export function remove(id) {
    const db = getConnection();

    const index = db.data.users.findIndex(x => x._id === id);
    if (index === -1) return;

    db.data.users.splice(index, 1);
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
