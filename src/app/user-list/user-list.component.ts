import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { HotToastService } from '@ngneat/hot-toast';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { User } from '../models/user.model';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UserComponent } from '../user/user.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['id', 'name', 'email', 'password', 'key'];
  dataSource!: MatTableDataSource<User>;
  subscribe!: Subscription;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  searchKey!: string;

  constructor(
    public auth: AuthService,
    private userService: UserService,
    private toast: HotToastService,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.getUsers();
    this.dataSource = new MatTableDataSource<User>();
  }

  logout() {
    this.auth.logout().pipe(
      this.toast.observe({
        success: 'Logged Out successfully',
        loading: 'Logging Out...',
        error: 'There was an error'
      })
    ).subscribe(
      () => this.router.navigate(['login'])
    );
  }

  getUsers() {
    this.subscribe = this.userService.loadUsers()
      .pipe(
        this.toast.observe({
          success: 'Load user successfully',
          loading: 'loading...',
          error: 'There was an error'
        })
      ).subscribe((data) => {
      this.dataSource = new MatTableDataSource<User>(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy() {
    if (this.subscribe) this.subscribe.unsubscribe();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchKey = filterValue;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onCreate() {
    this.userService.populateForm('');
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    this.dialog.open(UserComponent, dialogConfig);
  }

  onEdit(row: User) {
    const dialogConfig = new MatDialogConfig();

    this.userService.populateForm(row);
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    this.dialog.open(UserComponent, dialogConfig);
  }

  onDelete(data: User) {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirm Delete User',
        message: `Delete: ${data.name || data.email} you sure?`
      }
    });
    confirmDialog
      .afterClosed()
      .subscribe(res => {
        if (res) {
          let id = data.id
          this.userService.deleteUser(id)
            .pipe(

            )
            .subscribe()
        }
      })
  }
  onSearchClear() {
    this.searchKey = '';
    this.dataSource.filter = this.searchKey;
  }
}
