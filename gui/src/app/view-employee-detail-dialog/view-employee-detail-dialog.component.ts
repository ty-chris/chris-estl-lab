import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { UserModel } from '../models';
import { UserService } from '../services';

@Component({
  selector: 'app-view-employee-detail-dialog',
  templateUrl: './view-employee-detail-dialog.component.html',
  styleUrls: ['./view-employee-detail-dialog.component.scss'],
})
export class ViewEmployeeDetailDialogComponent implements OnInit {
  employee: UserModel;
  constructor(
    private userService: UserService,
    public dialogRef: MatDialogRef<ViewEmployeeDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  async ngOnInit(): Promise<void> {
    // const employee$ = this.userService.getUser(this.data.id);
    // this.employee = await lastValueFrom(employee$);
    this.employee = this.data;
  }
}
