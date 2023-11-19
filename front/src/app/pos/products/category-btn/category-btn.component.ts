import { Component, Input, OnInit } from "@angular/core";
import { Category } from "@app/shared/models";

@Component({
    selector: 'app-category-btn',
    templateUrl: './category-btn.component.html',
    styleUrls: ['./category-btn.component.scss'],
})
export class CategoryBtnComponent implements OnInit {
    @Input({ required: true }) category: Category = new Category();

    ngOnInit(): void {
    }
}
