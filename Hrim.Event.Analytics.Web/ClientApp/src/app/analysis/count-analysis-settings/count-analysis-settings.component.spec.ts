import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CountAnalysisSettingsComponent} from './count-analysis-settings.component';
import {EventTypeCountAnalysisSettings} from "../../shared/event-type-analysis-settings";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {LogService} from "../../services/log.service";
import {NotificationService} from "../../services/notification.service";

describe('CountAnalysisSettingsComponent', () => {
  let component: CountAnalysisSettingsComponent;
  let fixture: ComponentFixture<CountAnalysisSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[NoopAnimationsModule],
      declarations: [ CountAnalysisSettingsComponent ],
      providers:[LogService, NotificationService]
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
