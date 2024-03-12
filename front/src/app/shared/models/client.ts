export class Client {
    get label(): string {
        return `${this._id} - ${this.name}`;
    }

    constructor(public _id: string = "",
                public name: string = "Desconocido",
                public phone: string = "") {
    }

    json() {
        return {
            _id: this._id,
            name: this.name.toUpperCase(),
            phone: this.phone,
        }
    }

    public static fromJson(p: Record<string, string>) {
        return new Client(p['_id'], p['name'], p['phone']);
    }

    public static fromList(list: Array<Record<string, string>>) {
        return list.map(Client.fromJson);
    }
}
