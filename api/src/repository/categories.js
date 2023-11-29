import { getAdapter } from './excel.js';


export async function getAll() {
    const adapter = getAdapter();
    return [...adapter.categories];
}
