import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GapAnalysisSettingsComponent} from './gap-analysis-settings.component';
import {EventTypeGapAnalysisSettings} from "../../shared/event-type-analysis-settings";

describe('GapAnalysisSettingsComponent', () => {
  let component: GapAnalysisSettingsComponent;
  let fixture: ComponentFixture<GapAnalysisSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GapAnalysisSettingsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GapAnalysisSettingsComponent);
    component = fixture.componentInstance;
    component.analysisInfo = new EventTypeGapAnalysisSettings()
    component.analysisInfo.settings = {minimal_gap_length: "01:00:00:00"}
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
