import { Car } from "./car";
import { Client } from "./client";
import { Product } from "./product";


function round(result: number) {
    return Math.round((result + Number.EPSILON) * 100) / 100
}


export class Item {
    public get subtotal() {
        let base = this.product.price * this.quantity;

        if (!isNaN(+this.increment) && this.increment > 0) {
            base = base + (base * this.increment / 100)
        }

        if (!isNaN(+this.discount) && this.discount > 0) {
            base = base - (base * this.discount / 100)
        }

        return base;
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

    private _product: Record<string, string | number>;

    constructor(
        public product: Product = new Product(),
        public quantity: number = 1,
        public discount: number = 0,
        public increment: number = 0,
    ) {
        this._product = product.json();
    }

    toggleDiscount() {
        this.product = Product.fromJson(this._product);

        this.increment = 0;
        this.discount = 0;
    }

    toggleIncrement(enabled: boolean) {
        this.product = Product.fromJson(this._product);

        if (enabled) {
            this.increment = 5;
        } else {
            this.increment = 0;
        }
    }

    json() {
        return {
            product: {
                ...this.product.json(),
                // price: this.unitPrice
            },
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

    public get totalWithTaxes() {
        return round(this.total * 1.18);
    }

    constructor(
        public items: Item[] = [],
        public client: Client = new Client(),
        public car: Car = new Car(),
        public note: string = "SE INCLUIYE INSUMOS E INSTALACIÓN",
        public type: TransactionType = "COBRADO",
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
            note: this.note.toUpperCase(),
            type: this.type
        }
    }

    public static fromJson(data: Record<string, string | number | Record<string, string | number>>) {
        const { items: _items, client: _client, car: _car } = data;

        const items = (<any>_items).map((x: any) => {
            const { product, quantity, discount } = x;
            return new Item(Product.fromJson(product), quantity, discount);
        });

        const client = Client.fromJson(<any>_client);
        const car = Car.fromJson(<any>_car);

        return new DraftTransaction(items, client, car, <string>data['note'], <TransactionType>data['type'])
    }
}


class Seller {
    constructor(public _id: string = "",
                public name: string = "Desconocido") {
    }

    json() {
        return {
            _id: this._id,
            name: this.name,
        }
    }

    public static fromJson(p: Record<string, string>) {
        return new Client(p['_id'], p['name']);
    }

    public static fromList(list: Array<Record<string, string>>) {
        return list.map(Client.fromJson);
    }
}


export class Transaction {
    public get total() {
        return this.items.reduce((acc, curr) => curr.subtotal + acc, 0)
    }

    public get isPrintable(): boolean {
      return ["COTIZACION", "COBRADO"].includes(this.type);
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
        public createdAt: Date,
        public seller: Seller,
    ) {
    }

    public json(): any {
        return {
            _id: this._id,
            client: this.client.json(),
            items: this.items.map(x => x.json()),
            car: this.car.json(),
            note: this.note.toUpperCase(),
        }
    }

    public static fromJson(data: Record<string, string | number | Record<string, string | number>>) {
        const { items: _items, client: _client, car: _car, seller: _seller } = data;

        const items = (<any>_items).map((x: any) => {
            const { product, quantity, discount, increment } = x;
            return new Item(Product.fromJson(product), quantity, discount, increment);
        });

        const client = Client.fromJson(<any>_client);
        const car = Car.fromJson(<any>_car);
        const seller = Seller.fromJson(<any>_seller);

        return new Transaction(<string>data['_id'], items, client, car, <string>data['note'], <TransactionType>data['type'], new Date(<string>data['createdAt']), seller)
    }

    static fromList(transactions: Array<any>): Transaction[] {
        if (!Array.isArray(transactions)) {
            return [];
        }

        return transactions.map(p => this.fromJson(p))
    }
}
