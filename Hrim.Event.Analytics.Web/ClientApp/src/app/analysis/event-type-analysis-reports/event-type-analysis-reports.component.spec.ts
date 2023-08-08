import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventTypeAnalysisReportsComponent } from './event-type-analysis-reports.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {MatInputModule} from "@angular/material/input";
import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule
} from "@angular-material-components/datetime-picker";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {EventTypeService} from "../../services/user-event-type.service";
import {LogService} from "../../services/log.service";
import {HrimEventService} from "../../services/hrim-event.service";
import {FormBuilder} from "@angular/forms";
import {
  EventTypeAnalysisSettingsComponent
} from "../event-type-analysis-settings/event-type-analysis-settings.component";
import {EventTypeCountAnalysisSettings, EventTypeGapAnalysisSettings} from "../../shared/event-type-analysis-settings";
import {EventTypeTestData} from "../../../test_data/event-types";
import {AnalysisReports} from "../../shared/analysis-report.model";
import {MatFormField, MatFormFieldControl} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatDialogModule} from "@angular/material/dialog";
import {MatDatepickerModule} from "@angular/material/datepicker";

describe('EventTypeAnalysisReportsComponent', () => {
  let component: EventTypeAnalysisReportsComponent;
  let fixture: ComponentFixture<EventTypeAnalysisReportsComponent>;
  let testEventTypes: EventTypeTestData

  beforeEach(async () => {
    testEventTypes = new EventTypeTestData()
    await TestBed.configureTestingModule({
      declarations: [ EventTypeAnalysisReportsComponent ],
      imports     : [
        HttpClientTestingModule,
        MatIconModule,
        MatInputModule,
        MatButtonModule,
        MatDialogModule,
        MatSelectModule,
        MatDatepickerModule,
        NgxMatDatetimePickerModule,
        NgxMatTimepickerModule,
        NgxMatNativeDateModule,
        NoopAnimationsModule
      ],
      providers   : [
        EventTypeService, LogService,
        HrimEventService,
        FormBuilder
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventTypeAnalysisReportsComponent);
    component = fixture.componentInstance;
    component.eventType = testEventTypes.reading
    component.analysisReports = null
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
