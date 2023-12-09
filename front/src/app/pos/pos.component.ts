import { AfterViewInit, Component, OnInit } from "@angular/core";
import { PosService } from "./pos.service";

@Component({
    selector: 'app-pos',
    templateUrl: './pos.component.html',
    styleUrls: ['./pos.component.scss'],
})
export class PosComponent implements OnInit, AfterViewInit {
    isMobile = window.innerWidth < 450;

    constructor(private posService: PosService) {
    }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
    }
}
