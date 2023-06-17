import { Component } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { AuthService } from "src/app/components/service/auth.service";

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    emailFormControl = new FormControl('', [Validators.required, Validators.email]);
    passwordFormControl = new FormControl('', [Validators.required, Validators.minLength(8)]);

    constructor(private authService: AuthService) {
    }

    public async login() {
        if (this.emailFormControl.value && this.passwordFormControl.value && this.emailFormControl.valid && this.passwordFormControl.valid) {
            this.authService.login(this.emailFormControl.value, this.passwordFormControl.value);
        }
    }

    public async signup() {
        if (this.emailFormControl.value && this.passwordFormControl.value && this.emailFormControl.valid && this.passwordFormControl.valid) {
            this.authService.signup(this.emailFormControl.value, this.passwordFormControl.value);
        }
    }
}