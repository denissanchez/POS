import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";
import { AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { PERMISSION, PERMISSIONS, User } from "@app/shared/models/user";
import { UsersService } from "../users.service";
import { SwalComponent } from "@sweetalert2/ngx-sweetalert2";
import { ActivatedRoute, Router } from "@angular/router";
declare const bootstrap: any;


@Component({
    selector: 'app-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss']
})
export class EditComponent {
    private modal: any;
    @ViewChild('form', { static: false }) formRef!: ElementRef<HTMLDivElement>;
    @ViewChild('succcessUpdateAlert', { static: false }) succcessUpdateAlertRef!: SwalComponent;
    @ViewChild('errorUpdateAlert', { static: false }) errorUpdateAlertRef!: SwalComponent;
  
    public availablePermissions: PERMISSION[] = [...PERMISSIONS];
    public userForm: FormGroup;

    public changePassword = false;
  
    public get name(): FormControl {
      return this.userForm.get('name') as FormControl;
    }
  
    public get username(): FormControl {
      return this.userForm.get('username') as FormControl;
    }
  
    public get password(): FormControl {
      return this.userForm.get('password') as FormControl;
    }
  
    public get confirmPassword(): FormControl {
      return this.userForm.get('confirmPassword') as FormControl;
    }
  
    public get permissions(): FormArray {
      return this.userForm.get('permissions') as FormArray;
    }
  
    constructor(private usersService: UsersService, private route: ActivatedRoute, private router: Router) {
      this.userForm = new FormGroup({
        name: new FormControl('', [Validators.required]),
        username: new FormControl('', [Validators.required]),
        permissions: this.buildPermissionsArray(),
        password: new FormControl('', []),
        confirmPassword: new FormControl('', []),
      }, {
        validators: this.checkPasswords()
      });
    }

    ngOnInit() {
      this.usersService.getById(this.route.snapshot.params['id']).subscribe({
        next: (user) => {
          this.userForm.patchValue({
            name: user.name,
            username: user.username,
            permissions: user.permissions.map((permission) => this.availablePermissions.includes(permission))
          })
        }
      })
    }
  
    ngAfterViewInit() {
      this.modal = new bootstrap.Modal(this.formRef.nativeElement, {
        backdrop: 'static',
        keyboard: false
      })
      this.modal.show();
    }
  
    private checkPasswords = (): ValidatorFn => {
      return (group: AbstractControl): ValidationErrors | null => {
        let password = group.get('password')?.value;
        let confirmPassword = group.get('confirmPassword')?.value;
        return password === confirmPassword ? null : { notSame: true }
      }
    }
  
    buildPermissionsArray() {
      const arr = this.availablePermissions.map(_ => {
        return new FormControl(false);
      });
      return new FormArray(arr);
    }

    onToggleChangePassword(event: Event) {
      const isChecked = (event.target as HTMLInputElement).checked;
      if (isChecked) {
        this.password.setValidators([Validators.required]);
        this.confirmPassword.setValidators([Validators.required]);
      } else {
        this.password.setValue('');
        this.confirmPassword.setValue('');
        this.password.setValidators([]);
        this.confirmPassword.setValidators([]);
      }

      this.changePassword = isChecked;
      this.password.updateValueAndValidity();
      this.confirmPassword.updateValueAndValidity();
    }
  
    onSubmit() {
      const selectedPermissions = this.userForm.value.permissions
        .map((checked: boolean, i: number) => checked ? this.availablePermissions[i] : null)
        .filter((v: string) => v !== null);
  
      const { name, username, password } = this.userForm.value;
  
      const user = new User(this.route.snapshot.params['id'], name, username, selectedPermissions);
      user.setPassword(password);
  
      this.usersService.update(user).subscribe({
        next: () => {
          this.succcessUpdateAlertRef.fire().then(() => {
            this.onClose();
          });
        },
        error: (err) => {
          this.errorUpdateAlertRef.fire();
        }
      });
    }
  
    onClose() {
      this.modal.hide();
      this.router.navigate(['/usuarios']);
    }
}