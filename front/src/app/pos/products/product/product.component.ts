import { Component, Input, OnInit } from "@angular/core";
import { Product } from "@app/shared/models";
import { PosService } from "app/pos/pos.service";

@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
    @Input({ required: true }) product: Product = new Product();

    constructor(private posService: PosService) {
    }

    ngOnInit(): void { 
    }

    onClick() {
        this.posService.addProduct(this.product);
    }
}
