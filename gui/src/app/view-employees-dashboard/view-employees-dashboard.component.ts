import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { lastValueFrom, Subscription, takeUntil } from 'rxjs';
import { CreateEmployeeDetailDialogComponent } from '../create-employee-detail-dialog/create-employee-detail-dialog.component';
import { DeleteEmployeeDetailDialogComponent } from '../delete-employee-detail-dialog/delete-employee-detail-dialog.component';
import { FileUploadComponent } from '../file-upload/file-upload.component';
import { UserModel } from '../models';
import { UserService } from '../services';
import { UpdateEmployeeDetailDialogComponent } from '../update-employee-detail-dialog/update-employee-detail-dialog.component';
import { ViewEmployeeDetailDialogComponent } from '../view-employee-detail-dialog/view-employee-detail-dialog.component';

@Component({
  selector: 'app-view-employees-dashboard',
  templateUrl: './view-employees-dashboard.component.html',
  styleUrls: ['./view-employees-dashboard.component.scss'],
})
export class ViewEmployeesDashboardComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  displayedColumns: string[] = [
    'employeeId',
    'name',
    'login',
    'salary',
    'action',
  ];
  dataSource: MatTableDataSource<UserModel>;

  form = new FormGroup({
    minSalary: new FormControl(''),
    maxSalary: new FormControl(''),
  });

  formSubscription: Subscription;
  minSalaryErrorString: string;
  maxSalaryErrorString: string;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public dialog: MatDialog, private userService: UserService) {}

  ngOnInit(): void {
    this.formSubscription = this.form.valueChanges.pipe().subscribe((value) => {
      const minSalary = this.minSalary?.value;
      const maxSalary = this.maxSalary?.value;
      if (minSalary && parseInt(minSalary) < 0) {
        this.minSalaryErrorString =
          'Please enter a value greater than or equal to 0';
      } else {
        this.minSalaryErrorString = '';
      }

      if (
        maxSalary &&
        (parseInt(maxSalary) < 0 ||
          parseInt(maxSalary) < (minSalary ? parseInt(minSalary) : 0))
      ) {
        this.maxSalaryErrorString =
          'Value must be greater than Minimum Salary and/or 0';
      } else {
        this.maxSalaryErrorString = '';
      }
    });
  }

  get minSalary() {
    return this.form.get('minSalary');
  }

  get maxSalary() {
    return this.form.get('maxSalary');
  }

  async ngAfterViewInit() {
    // call get and init datasource
    await this.initDataSource();
  }

  async initDataSource() {
    const users$ = this.userService.getInitialUsers();
    this.dataSource = new MatTableDataSource(await lastValueFrom(users$));
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  async getFilteredUsers() {
    const minSalary = this.minSalary?.value ? this.minSalary?.value : 0;
    const maxSalary = this.maxSalary?.value
      ? this.maxSalary?.value
      : Number.MAX_SAFE_INTEGER;
    const filtered$ = this.userService.getAllUsersWithQuery(
      minSalary,
      maxSalary,
      0,
      Number.MAX_SAFE_INTEGER,
      '+id'
    );
    this.dataSource = new MatTableDataSource(await lastValueFrom(filtered$));
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  createUser() {
    const dialogConfig = new MatDialogConfig();
    const dialogRef = this.dialog.open(
      CreateEmployeeDetailDialogComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe(async (result) => {
      await this.initDataSource();
    });
  }

  viewUser(user) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = user;

    // Configure dialog size
    dialogConfig.minWidth = 450;
    const dialogRef = this.dialog.open(
      ViewEmployeeDetailDialogComponent,
      dialogConfig
    );
  }

  updateUser(user) {
    const dialogConfig = this.getDialogConfig(user);

    const dialogRef = this.dialog.open(
      UpdateEmployeeDetailDialogComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe(async (result) => {
      await this.initDataSource();
    });
  }

  deleteUser(user) {
    const dialogConfig = this.getDialogConfig(user);

    const dialogRef = this.dialog.open(
      DeleteEmployeeDetailDialogComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe(async (result) => {
      await this.initDataSource();
    });
  }

  openUploadFileDialog() {
    const dialogConfig = this.getDialogConfig();

    const dialogRef = this.dialog.open(FileUploadComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        await this.initDataSource();
      }
    });
  }

  getDialogConfig(user?: UserModel): MatDialogConfig {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.minWidth = 450;

    if (user) dialogConfig.data = user;

    return dialogConfig;
  }

  ngOnDestroy() {
    if (this.formSubscription) {
      this.formSubscription.unsubscribe();
    }
  }
}
