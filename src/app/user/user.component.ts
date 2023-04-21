import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../services/user.service';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {

  constructor(
    public dialogRef: MatDialogRef<UserComponent>,
    public service: UserService,
    private toast: HotToastService
  ) {
  }

  onClose() {
    this.service.form.reset();
    this.dialogRef.close();
  }

  submit() {
    if (this.service.form.valid) {
      if (this.service.form.get('id')?.value) {
        this.service.updateUser(this.service.form.value)
          .pipe(
            this.toast.observe({
              success: 'Update successfully',
              loading: 'loading...',
              error: ({message}) => `${message}`
            })
          ).subscribe(() => this.onClose());
      } else {
        this.service.addUser(this.service.form.value)
          .pipe(
            this.toast.observe({
              success: 'Add new user successfully',
              loading: 'loading...',
              error: ({message}) => `${message}`
            })
          )
          .subscribe(() => this.onClose())
      }
    }
  }
}
