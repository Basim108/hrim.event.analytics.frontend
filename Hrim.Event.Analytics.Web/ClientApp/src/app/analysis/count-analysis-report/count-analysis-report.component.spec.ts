import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountAnalysisReportComponent } from './count-analysis-report.component';
import {NoopAnimationsModule} from "@angular/platform-browser/animations";

describe('CountAnalysisReportComponent', () => {
  let component: CountAnalysisReportComponent;
  let fixture: ComponentFixture<CountAnalysisReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[NoopAnimationsModule],
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
