import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  Firestore, orderBy, query,
  updateDoc
} from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { from } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private fireStore: Firestore
  ) { }

  form: FormGroup = new FormGroup({
    id: new FormControl(null),
    email: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  populateForm(user: any) {
    if (user.id) {
      this.form.setValue({
        ...user
      })
    } else {
      this.form.reset();
    }
  }

  loadUsers() {
    const dbInstance = collection(this.fireStore, 'users');
    const userQuery = query(dbInstance, orderBy('name', 'desc'));
    return collectionData(userQuery, { idField: 'id' });
  }

  addUser(user: User) {
    const collectionInstance = collection(this.fireStore, 'users');

    return from(addDoc(collectionInstance, user));
  }

  updateUser(data: any) {
    const docInstance = doc(this.fireStore, 'users', data.id);
    const updateData = {
      ...data
    }
    return from(updateDoc(docInstance, updateData));

  }

  deleteUser(id: string | undefined) {
    // @ts-ignore
    const docInstance = doc(this.fireStore, 'users', id);

    return from(deleteDoc(docInstance));
  }
}
