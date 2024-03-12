export class Car {
    get summary(): string {
        if (this.plate === "") {
            return `${this.brand} ${this.model}`;
        }

        return `${this.brand} ${this.model} (${this.plate})`;
    }

    constructor(public brand: string = "-",
                public model: string = "-",
                public plate: string = "",
                public year: string = "") {
    }

    onClickBrand() {
      if (this.brand === '-') {
        this.brand = '';
      }
    }

    onClickModel() {
      if (this.model === '-') {
        this.model = '';
      }
    }

    onClickPlate() {
      if (this.plate === '-') {
        this.plate = '';
      }
    }

    onClickYear() {
      if (this.year === '-') {
        this.year = '';
      }
    }

    json() {
        return {
            brand: this.brand.toUpperCase(),
            model: this.model.toUpperCase(),
            plate: this.plate.toUpperCase(),
            year: this.year.toUpperCase()
        }
    }

    public static fromJson(data: Record<string, string>) {
        return new Car(data['brand'], data['model'], data['plate'], data["year"]);
    }
}
