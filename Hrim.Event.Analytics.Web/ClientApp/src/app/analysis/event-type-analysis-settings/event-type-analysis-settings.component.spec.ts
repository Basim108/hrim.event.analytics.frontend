import {ComponentFixture, TestBed} from '@angular/core/testing';
import {EventTypeAnalysisSettingsComponent} from './event-type-analysis-settings.component';
import {EventTypeCountAnalysisSettings, EventTypeGapAnalysisSettings} from "../../shared/event-type-analysis-settings";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {MatInputModule} from "@angular/material/input";
import {NgxMatNativeDateModule} from "@angular-material-components/datetime-picker";
import {EventTypeService} from "../../services/user-event-type.service";
import {LogService} from "../../services/log.service";
import {HrimEventService} from "../../services/hrim-event.service";
import {FormBuilder} from "@angular/forms";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {NotificationService} from "../../services/notification.service";

describe('EventTypeAnalysisSettingsComponent', () => {
  let component: EventTypeAnalysisSettingsComponent;
  let fixture: ComponentFixture<EventTypeAnalysisSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EventTypeAnalysisSettingsComponent],
      imports     : [
        HttpClientTestingModule,
        MatInputModule,
        NgxMatNativeDateModule,
        NoopAnimationsModule
      ],
      providers   : [
        EventTypeService, LogService,
        HrimEventService,
        FormBuilder,
        NotificationService
      ]
    }).compileComponents();

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
