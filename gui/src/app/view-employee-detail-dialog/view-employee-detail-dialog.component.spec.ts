import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEmployeeDetailDialogComponent } from './view-employee-detail-dialog.component';

describe('ViewEmployeeDetailDialogComponent', () => {
  let component: ViewEmployeeDetailDialogComponent;
  let fixture: ComponentFixture<ViewEmployeeDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewEmployeeDetailDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewEmployeeDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
