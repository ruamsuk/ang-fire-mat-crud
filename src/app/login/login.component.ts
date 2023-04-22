import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });
  hide = true;

  constructor(
    public authService: AuthService,
    private router: Router,
    private toast: HotToastService
  ) {

  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  submit() {
    if (this.loginForm.invalid) return;

    const {email, password} = this.loginForm.value;

    this.authService
      // @ts-ignore
      .login(email, password)
      .pipe(
        this.toast.observe({
          success: 'Logged in successfully',
          loading: 'Logging in...',
          error: ({ message }) => `${message}`
        })
      )
      .subscribe(() => {
        this.router.navigate(['user-list']).catch();
      });

  }

  onKeyup(event: KeyboardEvent) {
    if (this.loginForm.invalid) {
      return;
    }
    if (event.key !== undefined) {
      if (event.key == 'Enter') {
        this.submit();
      }
    }
  }

}
