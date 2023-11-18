import { getAdapter } from './excel.js';


async function getAll() {
    const adapter = getAdapter();
    return [...adapter.categories];
}


export { getAll }
