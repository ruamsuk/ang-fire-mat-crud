import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc, Firestore,
  orderBy,
  query,
  updateDoc
} from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { from } from 'rxjs';
import { User } from '../models/user.model';
import { Auth, updateProfile } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class UserService {

/*  get currentUserProfile$(): Observable<UserProfile | null> {
    return this.authService.currentUser$.pipe(
      switchMap((user) => {
        if (!user?.uid) {
          return of(null);
        }

        const ref = doc(this.fireStore, 'users', user.uid);
        return docData(ref) as Observable<UserProfile>;
      })
    );
  }*/

  constructor(
    private auth: Auth,
    private fireStore: Firestore,
  ) {
  }

  form: FormGroup = new FormGroup({
    id: new FormControl(null),
    email: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  populateForm(user: any) {
    if (user.id) {
      this.form.setValue({
        id: user.id,
        email: user.email,
        name: user.name,
        password: user.password,
      });
    } else {
      this.form.reset();
    }
  }

  loadUsers() {
    const dbInstance = collection(this.fireStore, 'users');
    const userQuery = query(dbInstance, orderBy('name', 'desc'));
    return collectionData(userQuery, {idField: 'id'});
  }

  addUser(user: User) {
    const collectionInstance = collection(this.fireStore, 'users');
    const {id} = doc(collectionInstance);
    const userData = {
      ...user,
      id: id,
      created: new Date(),
      modify: new Date()
    };

    return from(addDoc(collectionInstance, userData));
  }

/*  _addUser(user: UserProfile) {
    console.log(user);
    /!*const ref = doc(this.fireStore, 'users', user.uid);
    return from(setDoc(ref, user));*!/
  }*/

/*  _updateUser(user: UserProfile) {
    const ref = doc(this.fireStore, 'users', user.uid);
    return from(updateDoc(ref, {...user}));
  }*/

  upDateUser(users: any) {
    const user = this.auth.currentUser;
    // @ts-ignore
    return from(updateProfile(user, {
      displayName: users.name,
      email: users.email,
      photoURL: users.photoURL}));
  }

  updateUser(data: any) {
    console.log('photo-url: ', data);
    const docInstance = doc(this.fireStore, 'users', data.id);
    const updateData = {
      ...data, modify: new Date()
    };
    return from(updateDoc(docInstance, updateData));

  }

  deleteUser(id: string | undefined) {
    // @ts-ignore
    const docInstance = doc(this.fireStore, 'users', id);

    return from(deleteDoc(docInstance));
  }
}
