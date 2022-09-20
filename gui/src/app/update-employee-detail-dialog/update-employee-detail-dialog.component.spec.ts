import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateEmployeeDetailDialogComponent } from './update-employee-detail-dialog.component';

describe('UpdateEmployeeDetailDialogComponent', () => {
  let component: UpdateEmployeeDetailDialogComponent;
  let fixture: ComponentFixture<UpdateEmployeeDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateEmployeeDetailDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateEmployeeDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
