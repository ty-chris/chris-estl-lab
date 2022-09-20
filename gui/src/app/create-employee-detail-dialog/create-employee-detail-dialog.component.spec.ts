import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEmployeeDetailDialogComponent } from './create-employee-detail-dialog.component';

describe('CreateEmployeeDetailDialogComponent', () => {
  let component: CreateEmployeeDetailDialogComponent;
  let fixture: ComponentFixture<CreateEmployeeDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateEmployeeDetailDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateEmployeeDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
