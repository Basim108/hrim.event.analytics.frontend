import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CountAnalysisSettingsComponent} from './count-analysis-settings.component';
import {EventTypeCountAnalysisSettings} from "../../shared/event-type-analysis-settings";

describe('CountAnalysisSettingsComponent', () => {
  let component: CountAnalysisSettingsComponent;
  let fixture: ComponentFixture<CountAnalysisSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CountAnalysisSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CountAnalysisSettingsComponent);
    component = fixture.componentInstance;
    component.analysisInfo = new EventTypeCountAnalysisSettings();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
