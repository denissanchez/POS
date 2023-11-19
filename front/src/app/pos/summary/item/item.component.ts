import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Item } from "@app/shared/models/transaction";

@Component({
    selector: 'app-item',
    templateUrl: './item.component.html',
    styleUrls: ['./item.component.scss'],
})
export class ItemComponent implements OnInit {
    @Input({ required: true }) index: number = 0;
    //@ts-ignore
    @Input({ required: true }) item: Item = 0;
    @Output() onDelete: EventEmitter<void> = new EventEmitter<void>();
    
    ngOnInit(): void {
    }
}
