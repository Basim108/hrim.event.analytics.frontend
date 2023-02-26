import {ComponentFixture, TestBed} from '@angular/core/testing';

import {EventOfDayComponent}                            from './event-of-day.component';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {LogService}                                     from "../../../services/log.service";
import {EventTypeService}                               from "../../../services/user-event-type.service";
import {EVENT_TYPES}       from "../../../../test_data/event-types";
import {OCCURRENCE_EVENTS} from "../../../../test_data/events";
import {By}                from "@angular/platform-browser";
import {MatIconModule}                                  from "@angular/material/icon";
import {MatButtonModule}                                from "@angular/material/button";

describe('EventOfDayComponent', () => {
  let component: EventOfDayComponent;
  let fixture: ComponentFixture<EventOfDayComponent>;
  let eventTypeService: EventTypeService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
                                           declarations: [EventOfDayComponent],
                                           imports     : [
                                             HttpClientTestingModule,
                                             MatIconModule,
                                             MatButtonModule,
                                           ],
                                           providers   : [LogService]
                                         })
                 .compileComponents();
    eventTypeService = TestBed.inject(EventTypeService)

    fixture              = TestBed.createComponent(EventOfDayComponent);
    component            = fixture.componentInstance;
    component.eventOfDay = OCCURRENCE_EVENTS['reading_1']
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('given selected event type should display its event', () => {
    eventTypeService.updateTypeInfo(EVENT_TYPES['reading'], true)
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.event-of-day'))).not.toBeNull()
  });

  it('given no selected event type should hide its event', () => {
    eventTypeService.updateTypeInfo(EVENT_TYPES['reading'], false)
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.event-of-day'))).toBeNull()
  });

  it('given prevEvent with the same color should dash its own top border', () => {
    eventTypeService.updateTypeInfo(EVENT_TYPES['reading'], true)
    component.prevEventOfDay = OCCURRENCE_EVENTS['reading_1']
    fixture.detectChanges();

    const style = fixture.debugElement.parent?.nativeElement.querySelector('.event-of-day').getAttribute('style')
    expect(style).toContain('border-top: 1px dashed black')
  });

  it('given prevEvent with the different color should dash its own top border', () => {
    eventTypeService.updateTypeInfo(EVENT_TYPES['reading'], true)
    component.prevEventOfDay = OCCURRENCE_EVENTS['yoga_practice_1']
    fixture.detectChanges();

    const style = fixture.debugElement.parent?.nativeElement.querySelector('.event-of-day').getAttribute('style')
    expect(style).toContain('border-top: none')
  });
});
