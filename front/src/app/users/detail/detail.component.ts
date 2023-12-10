import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { PERMISSION, PERMISSIONS, User } from "@app/shared/models/user";
import { UsersService } from "../users.service";
import { Observable, of } from "rxjs";


declare const bootstrap: any;

@Component({
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss',],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailComponent implements AfterViewInit {
    private modal: any;
    @ViewChild('form', { static: false }) formRef!: ElementRef<HTMLDivElement>;
    public availablePermissions: PERMISSION[] = [...PERMISSIONS];
    public user$: Observable<User | undefined> = of(undefined);

    constructor(private usersService: UsersService, private route: ActivatedRoute, private router: Router) {
    }

    ngOnInit() {
        this.user$ = this.usersService.getById(this.route.snapshot.params['id']);
    }

    ngAfterViewInit(): void {
        this.modal = new bootstrap.Modal(this.formRef.nativeElement, {
            backdrop: 'static',
            keyboard: false
        })
        this.modal.show();
    }

    onClose() {
        this.modal.hide();
        this.router.navigate(['/usuarios']);
    }
}
