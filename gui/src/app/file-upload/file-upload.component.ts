import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
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
    private _snackBar: MatSnackBar,
    private translate: TranslateService
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

      const upload$ = this.userService.uploadCsv(formData);
      const uploaded = await lastValueFrom(upload$).catch((err) => {
        this.dialogRef.close(false);
        this.openErrorSnackbar();
      });
      if (uploaded) {
        this.dialogRef.close(true);
        this.openSuccessSnackbar();
      }
    }
  }

  openSuccessSnackbar() {
    this._snackBar.open(this.translate.instant('SUCCESS_UPLOAD_CSV'), 'Dismiss', { duration: 3000 });
  }

  openErrorSnackbar() {
    this._snackBar.open(this.translate.instant('ERROR_UPLOAD_CSV'), 'Dismiss', { duration: 3000 });
  }
}
