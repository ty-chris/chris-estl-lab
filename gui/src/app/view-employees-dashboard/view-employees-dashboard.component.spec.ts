import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEmployeesDashboardComponent } from './view-employees-dashboard.component';

describe('ViewEmployeesDashboardComponent', () => {
  let component: ViewEmployeesDashboardComponent;
  let fixture: ComponentFixture<ViewEmployeesDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewEmployeesDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewEmployeesDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
