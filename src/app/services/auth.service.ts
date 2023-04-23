import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  concatMap,
  from,
  Observable,
  of,
  switchMap
} from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  Auth, authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  UserCredential,
  UserInfo
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

  signUp(name: string | null | undefined, email: string | null | undefined, password: string | null | undefined): Observable<UserCredential> {
    // @ts-ignore
    return from(createUserWithEmailAndPassword(this.auth, <string>email, <string>password))
      .pipe(switchMap(({ user }) => updateProfile(user, { displayName: name }))
      )
  }

  login(email: string, password: string): Observable<any> {
    return from(signInWithEmailAndPassword(this.auth, <string>email, <string>password));
  }

  login_(email: string | null, password: string | null) {
    return from(this.afAuth.signInWithEmailAndPassword(<string>email, <string>password));
  }

  updateProfileData(profileData: Partial<UserInfo>) {
    const user = this.auth.currentUser;
    return of(user).pipe(
      concatMap((user) => {
        if (!user) throw new Error('Not Authenticates');
        return updateProfile(user, profileData);
      })
    );
  }


  logout(): Observable<any> {
    return from(this.auth.signOut());
  }

  public isLoggedIn(): boolean {
    return !!this.afAuth.currentUser;
  }
}
