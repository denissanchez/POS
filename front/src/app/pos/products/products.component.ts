import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { PosService } from "../pos.service";
import { Observable, Subscription, debounceTime, filter, fromEvent, map, mergeMap, of, tap } from "rxjs";
import { Category, Product } from "@app/shared/models";

@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit, AfterViewInit, OnDestroy {
    // @ts-ignore
    @ViewChild('searchInput', { static: false }) searchInput: ElementRef;

    activeCategory: string = "";
    search: string = "";

    products$: Observable<Product[]> = of([]);
    categories$: Observable<Category[]> = of([]);

    searchSubscription: Subscription | undefined;

    constructor(private posService: PosService) {
    }

    ngOnInit(): void {
        this.categories$ = this.posService.getCategories();
        this.refreshProducts();
    }

    ngAfterViewInit(): void {
        this.searchSubscription = fromEvent(this.searchInput.nativeElement, 'input')
            .pipe(
                map((t: any) => t.target.value.trim()),
                debounceTime(500),
            ).subscribe({
                next: () => this.products$ = this.posService.getAvailableProducts(this.search, this.activeCategory),
                error: console.error    
            })
    }

    refreshProducts() {
        this.products$ = this.posService.getAvailableProducts(this.search, this.activeCategory);
    }

    ngOnDestroy(): void {
        this.searchSubscription?.unsubscribe();
    }

    onChooseCategory(category: string) {
        this.activeCategory = category;
        this.products$ = this.posService.getAvailableProducts(this.search, this.activeCategory);
    }

    trackByProductId(index: number, product: Product) {
        return product._id;
    }
}
