import { Component, OnInit } from "@angular/core";

@Component({
    selector: 'app-summary',
    templateUrl: './summary.component.html',
    styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent implements OnInit {
    items: number[] = [1, 2, 3, 4];

    ngOnInit(): void {
    }
}
