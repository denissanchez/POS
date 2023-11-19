import { Component, Input, OnInit } from "@angular/core";

@Component({
    selector: 'app-item',
    templateUrl: './item.component.html',
    styleUrls: ['./item.component.scss'],
})
export class ItemComponent implements OnInit {
    @Input({ required: true }) index: number = 0;
    
    ngOnInit(): void {
    }
}
