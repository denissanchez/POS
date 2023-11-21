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
}
