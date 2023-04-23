import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AngularFireAuthGuard } from '@angular/fire/compat/auth-guard';
import { redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { UserListComponent } from './user-list/user-list.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  {
    path: 'login', component: LoginComponent,
    canActivate: [AngularFireAuthGuard],
    data: {authGuardPipe: () => redirectLoggedInTo(['user-list'])}
  },
  {
    path: 'user-list', component: UserListComponent,
    canActivate: [AngularFireAuthGuard],
    data: {authGuardPipe: () => redirectUnauthorizedTo(['login'])}
  },
  {
    path: 'profile', component: ProfileComponent,
    canActivate: [AngularFireAuthGuard],
    data: {authGuardPipe: () => redirectUnauthorizedTo(['login'])}
  },
  {
    path: 'sign-up', component: SignUpComponent
  },
  {
    path: '', redirectTo: 'login', pathMatch: 'full'
  },
  {
    path: '**', redirectTo: 'login', pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
