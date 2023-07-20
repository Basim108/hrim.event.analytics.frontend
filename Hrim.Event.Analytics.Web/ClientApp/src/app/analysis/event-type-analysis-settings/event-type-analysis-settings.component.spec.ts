import {ComponentFixture, TestBed} from '@angular/core/testing';

import {EventTypeAnalysisSettingsComponent} from './event-type-analysis-settings.component';
import {
  AnyEventTypeAnalysisSettings,
  EventTypeCountAnalysisSettings,
  EventTypeGapAnalysisSettings
} from "../../shared/event-type-analysis-settings";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatSelectModule} from "@angular/material/select";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {
  MAT_COLOR_FORMATS,
  NGX_MAT_COLOR_FORMATS,
  NgxMatColorPickerModule
} from "@angular-material-components/color-picker";
import {NgxMatNativeDateModule, NgxMatTimepickerModule} from "@angular-material-components/datetime-picker";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {EventTypeService} from "../../services/user-event-type.service";
import {LogService} from "../../services/log.service";
import {HrimEventService} from "../../services/hrim-event.service";
import {FormBuilder} from "@angular/forms";

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
        FormBuilder
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
