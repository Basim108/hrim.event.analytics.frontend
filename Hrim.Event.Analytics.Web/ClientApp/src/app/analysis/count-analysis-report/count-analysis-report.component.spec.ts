import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountAnalysisReportComponent } from './count-analysis-report.component';

describe('CountAnalysisReportComponent', () => {
  let component: CountAnalysisReportComponent;
  let fixture: ComponentFixture<CountAnalysisReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CountAnalysisReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CountAnalysisReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
