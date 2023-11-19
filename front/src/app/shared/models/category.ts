export class Category {
    constructor(
        public _id: string = "",
        public name: string = "Desconocida",
    ) { }

    static fromList(categories: Array<Record<string, string>>): Category[] {
        if (!Array.isArray(categories)) {
            return [];
        }

        return categories.map(p => new Category(p['_id'], p['name']))
    }
}
