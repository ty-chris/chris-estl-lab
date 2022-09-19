import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FileUploadComponent } from '../file-upload/file-upload.component';

@Component({
  selector: 'app-view-employees-dashboard',
  templateUrl: './view-employees-dashboard.component.html',
  styleUrls: ['./view-employees-dashboard.component.scss'],
})
export class ViewEmployeesDashboardComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'login', 'salary'];
  dataSource;

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    // call get and init datasource
  }

  openUploadFileDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.width = '40%';
    dialogConfig.height = '40%';

    const dialogRef = this.dialog.open(FileUploadComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      // if (result) {
      //   this.router.navigate(['/students/view-guardian'], {
      //     queryParams: { id: newGuardianId },
      //   });
      // } else {
      //   this.router.navigate(['/students/manage-guardians']);
      // }
    });
  }
}
