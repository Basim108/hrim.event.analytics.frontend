import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DayOfMonthComponent}     from './day-of-month.component';
import {EventOfDayComponent}     from "./event-of-day/event-of-day.component";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {LogService}              from "../../services/log.service";
import {HrimEventService}        from "../../services/hrim-event.service";
import {DayModel}                from "../../shared/day.model";
import {DateTime}                from "luxon";

describe('DayOfMonthComponent', () => {
  let component: DayOfMonthComponent;
  let fixture: ComponentFixture<DayOfMonthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
                                           declarations: [DayOfMonthComponent, EventOfDayComponent],
                                           imports     : [HttpClientTestingModule],
                                           providers   : [LogService, HrimEventService]
                                         })
                 .compileComponents();

    fixture   = TestBed.createComponent(DayOfMonthComponent);
    component = fixture.componentInstance;

    component.dayModel         = new DayModel(DateTime.now())
    component.currentMonth     = DateTime.now()
    component.occurrenceEvents = []
    component.durationEvents   = []
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
