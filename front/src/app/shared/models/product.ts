interface ConvertOption {
    label: string;
    code: string;
}

const POR_MAYOR_CONVERT_OPTION = {
    label: 'Por mayor',
    code: 'M'
}

const PUBLICO_CONVERT_OPTION = {
    label: 'Publico',
    code: ''
}


const LABEL_POR_MAYOR = 'Por mayor';
const LABEL_PUBLICO = 'Publico';


export class Product {
    public convertOptions: ConvertOption[] = [];

    constructor(
        public _id: string = "",
        public category: string = "No category",
        public cost: number = 0,
        public name: string = "Desconocido",
        public price: number = 0,
        public quantity: number = 0
    ) { 
        this.verifyConvertOptions();
    }

    private verifyConvertOptions() {
        if (this._id.startsWith('M')) {
            this.convertOptions = [{
                label: LABEL_PUBLICO,
                code: this._id.substring(1)
            }];
        } else {
            this.convertOptions = [{
                label: LABEL_POR_MAYOR,
                code: `M${this._id}`
            }];
        }
    }

    async convert(code: string) {
        try {
            const req = await fetch(`/api/v1/products/${code}`);

            if (!req.ok) {
                throw new Error();
            }

            const product = await req.json();

            this._id = <string>product['_id'];
            this.name = <string>product['name'];
            this.price = <number>product['price'];
            this.verifyConvertOptions();
        } catch (e) {
            alert('No hay información del producto para la opción seleccionada');
        }
    }

    clone() {
        return new Product(this._id, this.category, this.cost, this.name, this.price, this.quantity);
    }

    json() {
        return {
            _id: this._id,
            category: this.category,
            cost: this.cost,
            name: this.name,
            price: this.price,
            quantity: this.quantity,
        }
    }

    static fromJson(p: Record<string, string | number>) {
        return new Product(<string>p['_id'], <string>p['category'], <number>p['cost'], <string>p['name'], <number>p['price'], <number>p['quantity'])
    }

    static fromList(products: Array<Record<string, string | number>>): Product[] {
        if (!Array.isArray(products)) {
            return [];
        }

        return products.map(p => this.fromJson(p))
    }
}
