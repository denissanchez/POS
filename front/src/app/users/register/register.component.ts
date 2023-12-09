import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, Validator, ValidatorFn, Validators } from "@angular/forms";
import { PERMISSION, PERMISSIONS } from "@app/shared/models/user";


declare const bootstrap: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements AfterViewInit {
  private modal: any;
  @ViewChild('form', { static: false }) formRef!: ElementRef<HTMLDivElement>;

  public availablePermissions: PERMISSION[] = [...PERMISSIONS];
  public userForm: FormGroup;

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

  constructor(private fb: FormBuilder) {
    this.userForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
      permissions: this.buildPermissionsArray(),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
    }, {
      validators: this.checkPasswords()
    });
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
      return this.fb.control(false);
    });
    return this.fb.array(arr);
  }

  onSubmit() {
    const selectedPermissions = this.userForm.value.permissions
      .map((checked: boolean, i: number) => checked ? this.availablePermissions[i] : null)
      .filter((v: string) => v !== null);    

    const { name, username, password } = this.userForm.value;

    const user = {
      name: name.trim(),
      username: username.trim(),
      password,
      permissions: selectedPermissions
    };

    console.log(user);
  }

  onClose() {
    this.modal.hide();
  }
}
