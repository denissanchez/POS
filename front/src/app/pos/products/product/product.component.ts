import { Component, Input, OnInit } from "@angular/core";
import { Product } from "@app/shared/models";

@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
    @Input({ required: true }) product: Product = new Product();

    ngOnInit(): void {
    }
}
