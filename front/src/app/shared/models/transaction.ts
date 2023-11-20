import { Client } from "./client";
import { Product } from "./product";
import { Car } from "./car";


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

export type TransactionType = "CREDITO" | "COBRADO" | "COTIZACION";

export class DraftTransaction {
    public get total() {
        return this.items.reduce((acc, curr) => curr.subtotal + acc, 0)
    }

    public get totalDiscounted() {
        return this.items.reduce((acc, curr) => curr.subtotalDiscounted + acc, 0)
    }

    constructor(
        public items: Item[] = [],
        public client: Client = new Client(),
        public car: Car = new Car(),
        public note: string = "",
        public type: TransactionType = "COBRADO",
        public validUntil: Date = new Date(),
    ) {}

    public getUnsatisfiedProducts(): string[] {
        const warnings: string[] = [];

        const transformProductName = (name: string) => {
            return name.replace(' (Por mayor)', '').replace(' (Con tarjeta)', '');
        }

        this.items.forEach((item) => {
            if (item.product.quantity == 0) {
                warnings.push(`${transformProductName(item.product.name)} (Sin stock)`)
            } else if (item.quantity > item.product.quantity) {
                warnings.push(`${transformProductName(item.product.name)} (Falta ${item.quantity - item.product.quantity} UND.)`)
            }
        })

        return warnings;
    }
}
