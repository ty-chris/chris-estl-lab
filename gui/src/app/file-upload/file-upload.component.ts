import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { lastValueFrom } from 'rxjs';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent implements OnInit {
  myForm = new FormGroup({
    file: new FormControl('', [Validators.required]),
    fileSource: new FormControl('', [Validators.required]),
  });

  constructor(
    public dialogRef: MatDialogRef<FileUploadComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  get f() {
    return this.myForm.controls;
  }
  uploadFileEvt(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      const csv = event.target.files[0];
      this.myForm.patchValue({ fileSource: csv });

      console.log('check value', this.myForm.get('fileSource')!.value);
    }
  }

  async submit() {
    const formData = new FormData();

    const csv = this.myForm.get('fileSource')!.value;

    if (csv) {
      formData.append('csv', csv);
      console.log('form data', formData.get('csv'));

      const upload$ = this.userService.uploadCsv(formData);
      const uploaded = await lastValueFrom(upload$);
      if (uploaded) {
        console.log('file uploaded');
        this.openFileUploadSuccessSnackbar();
        this.dialogRef.close(true);
      } else {
        this.dialogRef.close(false);
      }
    }
  }

  openFileUploadSuccessSnackbar() {
    this._snackBar.open('Successfully uploaded file', 'Dismiss', { duration: 3000 });
  }

  openFileUploadErrorSnackbar() {
    this._snackBar.open('Error occured while uploading', 'Dismiss', { duration: 3000 });
  }
}
