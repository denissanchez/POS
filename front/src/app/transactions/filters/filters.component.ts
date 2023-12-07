import { AfterViewInit, Component, EventEmitter, Output } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { endOfDay, format, getUnixTime, isValid, startOfDay } from "date-fns";


@Component({
    selector: 'app-filters',
    templateUrl: './filters.component.html',
    styleUrls: ['./filters.component.scss'],
})
export class FiltersComponent implements AfterViewInit {
    from: Date = new Date();
    to: Date = new Date();

    @Output() onUpdateRange: EventEmitter<{
        from: string,
        to: string,
    }> = new EventEmitter();

    constructor(private activatedRoute: ActivatedRoute, private router: Router) {
    }

    ngAfterViewInit(): void {
        const from = this.activatedRoute.snapshot.queryParams['from'];
        const to = this.activatedRoute.snapshot.queryParams['to'];

        if (!isNaN(+from) && !isNaN(+to)) {
            this.from = new Date(+from * 1000);
            this.to = new Date(+to * 1000);
        } else {
            this.from = startOfDay(new Date());
            this.to = endOfDay(new Date());
        }

        setTimeout(() => {
            this.emit();
        }, 500)
    }

    private emit() {
        this.onUpdateRange.emit({
            from: this.from.toISOString(),
            to: this.to.toISOString(),
        });

        this.router.navigate([], {
            queryParams: {
                from: getUnixTime(this.from),
                to: getUnixTime(this.to),
            },
            queryParamsHandling: 'merge'
        });
    }

    onChangeFrom(value: string) {
        try {
            this.from = new Date(`${value}T00:00:00.000-05:00`);
        } catch (e) {
            console.error(e);
            return;
        }
        
        this.emit();
    }

    onChangeTo(value: string) {
        try {
            this.to =new Date(`${value}T23:59:59.000-05:00`);
        } catch (e) {
            console.error(e);
            return;
        }

        this.emit();
    }
}
