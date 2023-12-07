import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { Item } from "@app/shared/models/transaction";

@Component({
    selector: 'app-item',
    templateUrl: './item.component.html',
    styleUrls: ['./item.component.scss'],
})
export class ItemComponent implements OnInit, OnChanges {
    @Input({ required: true }) index: number = 0;
    //@ts-ignore
    @Input({ required: true }) item: Item = 0;
    @Input({ required: true }) showDiscount: boolean = false;
    @Input({ required: true }) showIncrement: boolean = false;

    @Output() onDelete: EventEmitter<void> = new EventEmitter<void>();

    ngOnChanges(changes: SimpleChanges): void {
        for (const propName in changes) {
            if (propName === 'showIncrement') {
                this.item.toggleIncrement(changes[propName].currentValue);
            }

            if (propName === 'showDiscount') {
                this.item.toggleDiscount();
            }
        }
    }
    
    ngOnInit(): void {
    }
}
