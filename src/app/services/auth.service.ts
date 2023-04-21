import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  Auth, authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  UserCredential
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser$ = authState(this.auth);
  loggedIn = new BehaviorSubject<boolean>(false);
  loggedIn$ = this.loggedIn.asObservable();

  constructor(
    private auth: Auth,
    private afAuth: AngularFireAuth
  ) {
    this.afAuth.onAuthStateChanged((user) => {
      if (user) {
        this.loggedIn.next(true);
      } else {
        // not logged in
        this.loggedIn.next(false);
      }
    }).then();
  }

  signUp(email: string, password: string): Observable<UserCredential> {
    return from(createUserWithEmailAndPassword(this.auth, email, password));
  }

  login(email: string, password: string): Observable<any> {
    return from(signInWithEmailAndPassword(this.auth, <string>email, <string>password));
  }

  login_(email: string | null, password: string | null) {
    return from(this.afAuth.signInWithEmailAndPassword(<string>email, <string>password));
  }


  logout(): Observable<any> {
    return from(this.auth.signOut());
  }

  public isLoggedIn(): boolean {
    return !!this.afAuth.currentUser;
  }
}
