import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { lastValueFrom } from 'rxjs';
import { UserService } from '../services';

@Component({
  selector: 'app-create-employee-detail-dialog',
  templateUrl: './create-employee-detail-dialog.component.html',
  styleUrls: ['./create-employee-detail-dialog.component.scss'],
})
export class CreateEmployeeDetailDialogComponent implements OnInit {
  form = new FormGroup({
    employeeId: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    login: new FormControl('', [Validators.required]),
    salary: new FormControl('', [Validators.required]),
  });

  constructor(
    private userService: UserService,
    public dialogRef: MatDialogRef<CreateEmployeeDetailDialogComponent>,
    private _snackBar: MatSnackBar,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {}

  get employeeId() {
    return this.form.get('employeeId');
  }

  get name() {
    return this.form.get('name');
  }

  get login() {
    return this.form.get('login');
  }

  get salary() {
    return this.form.get('salary');
  }

  async updateEmployee() {
    const create = { name: this.name!.value, login: this.login!.value, salary: this.salary!.value };
    // const update$ = this.userService.updateUser(this.employee.employeeId, update);
    // const updated = await lastValueFrom(update$).catch(
    //   (err) => (this.errMsg = this.translate.instant('BAD_REQUEST_ERROR'))
    // );

    // if (updated) {
    //   this.openFileUploadSuccessSnackbar();
    //   this.dialogRef.close(true);
    // } else {
    //   this.openFileUploadSuccessSnackbar();
    //   this.dialogRef.close(false);
    // }
  }

  openFileUploadSuccessSnackbar() {
    this._snackBar.open(this.translate.instant('SUCCESS_CREATE_MSG'), 'Dismiss', { duration: 3000 });
  }

  openFileUploadErrorSnackbar() {
    this._snackBar.open(this.translate.instant('ERROR_CREATE_MSG'), 'Dismiss', { duration: 3000 });
  }
}
