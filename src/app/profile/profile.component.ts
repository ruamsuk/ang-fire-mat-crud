import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { HotToastService } from '@ngneat/hot-toast';
import { ImageUploadService } from '../services/image-upload.service';
import { User } from '@angular/fire/auth';
import { concatMap } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  user$ = this.authService.currentUser$;

  profileForm = new FormGroup({
    uid: new FormControl(''),
    displayName: new FormControl(''),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    phone: new FormControl(''),
    address: new FormControl(''),
  });

  constructor(
    private authService: AuthService,
    private imageUploadService: ImageUploadService,
    private toast: HotToastService
  ) { }

  uploadImage(event: any, user: User) {
    this.imageUploadService
      .uploadImage(event.target.files[0], `images/profile/${user.uid}`)
      .pipe(
        this.toast.observe({
          loading: 'loading...',
          success: 'Image Uploaded',
          error: ({ message }) => `${message}`
        }),
        concatMap((photoURL) =>
          this.authService.updateProfileData({ photoURL})
        )
      )
      .subscribe();
  }

  saveProfile() {

  }
}
