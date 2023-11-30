import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { SwalComponent } from "@sweetalert2/ngx-sweetalert2";
import { PosService } from "./pos.service";

@Component({
    selector: 'app-pos',
    templateUrl: './pos.component.html',
    styleUrls: ['./pos.component.scss'],
})
export class PosComponent implements OnInit, AfterViewInit {
    // @ts-ignore
    @ViewChild('lowStockAlert', { static: false }) private lowStockAlert: SwalComponent;
    // @ts-ignore
    @ViewChild('exceededStockAlert', { static: false }) private exceededStockAlert: SwalComponent;

    isMobile = window.innerWidth < 450;

    constructor(private posService: PosService) {
    }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        this.posService.exceededStockSwal = this.exceededStockAlert;
        this.posService.lowStockSwal = this.lowStockAlert;
    }
}
