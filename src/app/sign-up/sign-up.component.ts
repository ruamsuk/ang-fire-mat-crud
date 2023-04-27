import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { HotToastService } from '@ngneat/hot-toast';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

export function passwordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return {passwordsDontMatch: true};
    } else {
      return null;
    }
  };
}

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {

  hide = true;

  signUpForm = this.fb.group(
    {
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    },
    {validators: passwordMatchValidator()}
  );

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private toast: HotToastService,
    private router: Router,
    private fb: FormBuilder
  ) {
  }

  get name() {
    return this.signUpForm.get('name');
  }

  get email() {
    return this.signUpForm.get('email');
  }

  get password() {
    return this.signUpForm.get('password');
  }

  get confirmPassword() {
    return this.signUpForm.get('confirmPassword');
  }

  onSubmit() {
    if (this.signUpForm.invalid) return;

    const {name, email, password} = this.signUpForm.value;

    this.authService
      .signUp(name, email, password)
      .pipe(
        this.toast.observe({
          loading: 'loading...',
          success: 'Congrats SignUp Successfully.',
          error: ({message}) => `${message}`
        })
      ).subscribe(() => {
      // this.authService.currentUser$.subscribe((data) => console.log(data));
      this.router.navigate(['/']).catch();
    });


  }

  onKeyup(event: KeyboardEvent) {
    if (this.signUpForm.invalid) {
      return;
    }
    if (event.key !== undefined) {
      if (event.key == 'Enter') {
        this.onSubmit();
      }
    }
  }

}
