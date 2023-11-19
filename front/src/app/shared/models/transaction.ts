import { Product } from "./product";


function round(result: number) {
    return Math.round((result + Number.EPSILON) * 100) / 100
}


export class Item {
    public get subtotal() {
        const base = this.product.price * this.quantity;

        if (!isNaN(+this.discount) && this.discount > 0) {
            return round(base - (base * this.discount / 100))
        }
        return round(base)
    }

    public get subtotalDiscounted() {
        const base = this.product.price * this.quantity;

        if (!isNaN(+this.discount) && this.discount > 0) {
            return round(base * this.discount / 100);
        }

        return round(0)
    }

    constructor(
        public product: Product = new Product(),
        public quantity: number = 1,
        public discount: number = 0,
    ) {}
}


export class DraftTransaction {
    public get total() {
        return this.items.reduce((acc, curr) => curr.subtotal + acc, 0)
    }

    public get totalDiscounted() {
        return this.items.reduce((acc, curr) => curr.subtotalDiscounted + acc, 0)
    }

    constructor(
        public items: Item[] = [],
    ) {}
}
