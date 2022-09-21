import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

import { ViewEmployeeDetailDialogComponent } from './view-employee-detail-dialog.component';

describe('ViewEmployeeDetailDialogComponent', () => {
  let component: ViewEmployeeDetailDialogComponent;
  let fixture: ComponentFixture<ViewEmployeeDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule,
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
      ],
      declarations: [ViewEmployeeDetailDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewEmployeeDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
