import {ComponentFixture, TestBed} from '@angular/core/testing';

import {EventTypeAnalysisSettingsComponent} from './event-type-analysis-settings.component';
import {
  AnyEventTypeAnalysisSettings,
  EventTypeCountAnalysisSettings,
  EventTypeGapAnalysisSettings
} from "../../shared/event-type-analysis-settings";

describe('AnalysisSettingsComponent', () => {
  let component: EventTypeAnalysisSettingsComponent;
  let fixture: ComponentFixture<EventTypeAnalysisSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EventTypeAnalysisSettingsComponent]
    })
                 .compileComponents();

    fixture = TestBed.createComponent(EventTypeAnalysisSettingsComponent);
    component = fixture.componentInstance;
    component.eventTypeId = "test-type-id"
    const gapAnalysis = new EventTypeGapAnalysisSettings();
    gapAnalysis.settings = {minimal_gap_length: "01:00:00:00"}
    component.settings = [gapAnalysis, new EventTypeCountAnalysisSettings()]
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
