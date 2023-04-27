import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { HotToastService } from '@ngneat/hot-toast';
import { ImageUploadService } from '../services/image-upload.service';
import { User } from '@angular/fire/auth';
import { switchMap } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { UserService } from '../services/user.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user$ = this.authService.currentUser$;

  profileForm = new FormGroup({
    uid: new FormControl(''),
    displayName: new FormControl(''),
    email: new FormControl(''),
    phoneNumber: new FormControl(''),
  });
  private user!: User | null;

  constructor(
    public authService: AuthService,
    private userService: UserService,
    private afAuth: AngularFireAuth,
    private imageUploadService: ImageUploadService,
    private toast: HotToastService
  ) {
  }

  ngOnInit() {
    this.authService.currentUser$
      .subscribe((res) => {
        this.profileForm.patchValue({...res});
        this.user = res;
      });
  }

  uploadImage(event: any) {
    const uid = this.user?.uid;

    this.imageUploadService
      .uploadImage(event.target.files[0], `images/profile/${uid}`)
      .pipe(
        this.toast.observe({
          loading: 'loading...',
          success: 'Image Uploaded',
          error: ({message}) => `${message}`
        }),
        // @ts-ignore
        switchMap((photoURL) => {
            this.userService.upDateUser({
              uid, photoURL
            });
          }
        )
      ).subscribe();

  }

  saveProfile() {
    const profileData = this.profileForm.value;
    this.userService.upDateUser(profileData)
      .pipe(
        this.toast.observe({
          loading: 'loading...',
          success: 'Updated User Profile Success',
          error: ({message}) => `${message}`
        })
      ).subscribe();
  }
}
