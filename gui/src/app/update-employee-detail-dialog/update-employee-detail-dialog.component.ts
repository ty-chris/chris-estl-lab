import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { lastValueFrom } from 'rxjs';
import { UserModel } from '../models';
import { UserService } from '../services';

@Component({
  selector: 'app-update-employee-detail-dialog',
  templateUrl: './update-employee-detail-dialog.component.html',
  styleUrls: ['./update-employee-detail-dialog.component.scss'],
})
export class UpdateEmployeeDetailDialogComponent implements OnInit {
  employee: UserModel;
  form: FormGroup;

  errMsg: string;

  constructor(
    private userService: UserService,
    public dialogRef: MatDialogRef<UpdateEmployeeDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _snackBar: MatSnackBar,
    private translate: TranslateService
  ) {}

  async ngOnInit(): Promise<void> {
    this.employee = this.data;
    this.form = new FormGroup({
      employeeId: new FormControl(this.employee.employeeId),
      name: new FormControl(this.employee.name, [Validators.required]),
      login: new FormControl(this.employee.login, [Validators.required]),
      salary: new FormControl(this.employee.salary, [Validators.required]),
    });

    this.form.get('employeeId')?.disable();
  }

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
    const update = { name: this.name!.value, login: this.login!.value, salary: this.salary!.value };
    const update$ = this.userService.updateUser(this.employee.employeeId, update);
    const updated = await lastValueFrom(update$).catch(
      (err) => (this.errMsg = this.translate.instant('BAD_REQUEST_ERROR'))
    );

    if (updated) {
      this.openFileUploadSuccessSnackbar();
      this.dialogRef.close(true);
    } else {
      this.openFileUploadSuccessSnackbar();
      this.dialogRef.close(false);
    }
  }

  openFileUploadSuccessSnackbar() {
    this._snackBar.open(this.translate.instant('SUCCESS_UPDATE_MSG'), 'Dismiss', { duration: 3000 });
  }

  openFileUploadErrorSnackbar() {
    this._snackBar.open(this.translate.instant('ERROR_UPDATE_MSG'), 'Dismiss', { duration: 3000 });
  }
}
