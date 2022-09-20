import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteEmployeeDetailDialogComponent } from './delete-employee-detail-dialog.component';

describe('DeleteEmployeeDetailDialogComponent', () => {
  let component: DeleteEmployeeDetailDialogComponent;
  let fixture: ComponentFixture<DeleteEmployeeDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteEmployeeDetailDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteEmployeeDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
