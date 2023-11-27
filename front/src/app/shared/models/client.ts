export class Client {
    constructor(public _id: string = "",
                public name: string = "Desconocido",
                public phone: string = "") {
    }

    json() {
        return {
            _id: this._id,
            name: this.name,
            phone: this.phone,
        }
    }

    public static fromJson(p: Record<string, string>) {
        return new Client(p['_id'], p['name'], p['phone']);
    }
}
