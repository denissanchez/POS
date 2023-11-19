import { Component, OnInit } from "@angular/core";
import { PosService } from "../pos.service";
import { Observable, of } from "rxjs";
import { Category, Product } from "@app/shared/models";

@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
    products$: Observable<Product[]> = of([]);
    categories$: Observable<Category[]> = of([]);

    constructor(private posService: PosService) {
    }

    ngOnInit(): void {
        this.categories$ = this.posService.getCategories();
        this.products$ = this.posService.getAvailableProducts();
    }
}
