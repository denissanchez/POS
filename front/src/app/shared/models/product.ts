export class Product {
    constructor(
        public _id: string = "",
        public category: string = "No category",
        public cost: number = 0,
        public name: string = "Desconocido",
        public price: number = 0,
        public quantity: number = 0
    ) { }

    static fromList(products: Array<Record<string, string | number>>): Product[] {
        if (!Array.isArray(products)) {
            return [];
        }

        return products.map(p => new Product(<string>p['_id'], <string>p['category'], <number>p['cost'], <string>p['name'], <number>p['price'], <number>p['quantity']))
    }
}
