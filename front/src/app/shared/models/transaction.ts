import { Client } from "./client";
import { Product } from "./product";
import { Car } from "./car";
import { addBusinessDays } from "date-fns";


function round(result: number) {
    return Math.round((result + Number.EPSILON) * 100) / 100
}


export class Item {
    public get subtotal() {
        const base = this.product.price * this.quantity;

        if (!isNaN(+this.increment) && this.increment > 0) {
            return round(base + (base * this.increment / 100))
        }

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

    public get subtotalIncremented() {
        const base = this.product.price * this.quantity;

        if (!isNaN(+this.increment) && this.increment > 0) {
            return round(base * this.increment / 100);
        }

        return round(0)
    }

    get unitPrice() {
        const base = this.product.price;

        if (!isNaN(+this.increment) && this.increment > 0) {
            return round(base + (base * this.increment / 100))
        }

        if (!isNaN(+this.discount) && this.discount > 0) {
            return round(base - (base * this.discount / 100))
        }

        return round(base)
    }

    constructor(
        public product: Product = new Product(),
        public quantity: number = 1,
        public discount: number = 0,
        public increment: number = 0,
    ) {}

    toggleDiscount() {
        this.discount = 0;
    }

    toggleIncrement(enabled: boolean) {
        if (enabled) {
            this.increment = 5;
        } else {
            this.increment = 0;
        }
    }

    json() {
        return {
            product: this.product.json(),
            quantity: this.quantity,
            discount: this.discount,
            increment: this.increment,
            subtotal: this.subtotal,
            subtotalDiscounted: this.subtotalDiscounted
        }
    }
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
        public validUntil: Date = addBusinessDays(new Date(), 7),
    ) { }

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

    json() {
        return {
            items: this.items.map(x => x.json()),
            client: this.client.json(),
            car: this.car.json(),
            note: this.note,
            type: this.type,
            validUntil: this.validUntil.toISOString()
        }
    }
}


export class Transaction {
    public get total() {
        return this.items.reduce((acc, curr) => curr.subtotal + acc, 0)
    }

    public get isPrintable(): boolean {
        return this.type === "COTIZACION";
    }

    public get printUrl(): string {
        return `/api/v1/transactions/print/${this._id}`;
    }

    constructor(
        public _id: string,
        public items: Item[],
        public client: Client,
        public car: Car,
        public note: string,
        public type: TransactionType,
        public validUntil: Date,
        public createdAt: Date
    ) {
    }
    

    public static fromJson(data: Record<string, string | number | Record<string, string | number>>) {
        const { items: _items, client: _client, car: _car } = data;

        const items = (<any>_items).map((x: any) => {
            const { product, quantity, discount } = x;
            return new Item(Product.fromJson(product), quantity, discount);
        });

        const client = Client.fromJson(<any>_client);
        const car = Car.fromJson(<any>_car);

        return new Transaction(<string>data['_id'], items, client, car, <string>data['note'], <TransactionType>data['type'], new Date(<string>data['validUntil']), new Date(<string>data['createdAt']))
    }

    static fromList(transactions: Array<any>): Transaction[] {
        if (!Array.isArray(transactions)) {
            return [];
        }

        return transactions.map(p => this.fromJson(p))
    }
}

