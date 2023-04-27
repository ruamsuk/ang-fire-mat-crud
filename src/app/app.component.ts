import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ang-fire-mat-crud';

  constructor(
    public auth: AuthService,
    private router: Router,
  ) {
  }

  logout() {
    this.auth.logout()
      .subscribe(() => this.router.navigate(['/']));
  }

}
