import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GapAnalysisReportComponent} from './gap-analysis-report.component';
import {NoopAnimationsModule} from "@angular/platform-browser/animations";

describe('GapAnalysisReportComponent', () => {
  let component: GapAnalysisReportComponent;
  let fixture: ComponentFixture<GapAnalysisReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      declarations: [GapAnalysisReportComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(GapAnalysisReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
