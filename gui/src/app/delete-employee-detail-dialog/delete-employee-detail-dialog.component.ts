import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { lastValueFrom } from 'rxjs';
import { UserModel } from '../models';
import { UserService } from '../services';
import { UpdateEmployeeDetailDialogComponent } from '../update-employee-detail-dialog/update-employee-detail-dialog.component';

@Component({
  selector: 'app-delete-employee-detail-dialog',
  templateUrl: './delete-employee-detail-dialog.component.html',
  styleUrls: ['./delete-employee-detail-dialog.component.scss'],
})
export class DeleteEmployeeDetailDialogComponent implements OnInit {
  employee: UserModel;

  constructor(
    private userService: UserService,
    public dialogRef: MatDialogRef<UpdateEmployeeDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _snackBar: MatSnackBar,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.employee = this.data;
  }

  async deleteEmployee() {
    const delete$ = this.userService.deleteUser(this.employee.employeeId);

    const deleted = await lastValueFrom(delete$).catch((err) => {
      this.dialogRef.close(false);
      this.openErrorSnackbar();
    });

    this.dialogRef.close(true);
    this.openSuccessSnackbar();
  }

  openSuccessSnackbar() {
    this._snackBar.open(this.translate.instant('SUCCESS_DELETE_MSG'), 'Dismiss', { duration: 3000 });
  }

  openErrorSnackbar() {
    this._snackBar.open(this.translate.instant('ERROR_DELETE_MSG'), 'Dismiss', { duration: 3000 });
  }
}
