import { getAdapter } from './excel.js';


async function getAll() {
    const adapter = getAdapter();
    return [...adapter.products];
}


async function getById(_id) {
    const adapter = getAdapter();
    return await adapter.getById(_id);
}


async function search(term) {
    const adapter = getAdapter();
    return await adapter.search(term)
}


export { getAll, getById, search };
