export class Car {
    constructor(public brand: string = "-",
                public model: string = "-",
                public plate: string = "") {
    }

    json() {
        return {
            brand: this.brand,
            model: this.model,
            plate: this.plate
        }
    }

    public static fromJson(data: Record<string, string>) {
        return new Car(data['brand'], data['model'], data['plate']);
    }
}
