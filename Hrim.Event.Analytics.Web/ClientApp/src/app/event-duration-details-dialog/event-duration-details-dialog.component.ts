import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {LogService} from "../services/log.service";
import {EventTypeService} from "../services/user-event-type.service";
import {Subscription} from "rxjs";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DateTime} from "luxon";
import {DATE_FORMAT, HrimEventService} from "../services/hrim-event.service";
import {UserEventType} from "../shared/event-type.model";
import {DurationEvent} from "../shared/events.model";
import {DialogDetailsRequest} from "../shared/dialog-details-request";
import {EventOfDayModel} from "../event-of-day/event-of-day.model";

const TIME_FORMAT = 'HH:mm'

@Component({
  selector: 'app-event-duration-details-dialog',
  templateUrl: './event-duration-details-dialog.component.html',
  styleUrls: ['./event-duration-details-dialog.component.css']
})
export class EventDurationDetailsDialog implements OnInit, OnDestroy {
  eventTypes: UserEventType[]

  started_on: DateTime
  started_at: string
  finished_on: DateTime | null
  finished_at: string | null

  isChanged: boolean = false
  form: FormGroup

  formValueChangeSub: Subscription
  saveEventSub: Subscription
  eventTypeSub: Subscription

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogDetailsRequest<DurationEvent>,
              private dialogRef: MatDialogRef<EventDurationDetailsDialog>,
              private formBuilder: FormBuilder,
              private logger: LogService,
              private eventService: HrimEventService,
              private eventTypeService: EventTypeService) {
    logger.logConstructor(this)
  }

  ngOnInit(): void {
    const format = `${DATE_FORMAT} HH:mm:ss.SSSZZ`;
    this.started_on = this.data.entity?.started_at
                      ? DateTime.fromFormat(this.data.entity.started_at, format)
                      : DateTime.now()
    this.started_at = this.started_on.toFormat(TIME_FORMAT)
    this.finished_on = this.data.entity?.finished_at
                       ? DateTime.fromISO(this.data.entity.finished_at)
                       : null
    this.finished_at = this.finished_on?.toFormat(TIME_FORMAT) || null

    this.form = this.formBuilder.group({
      event_type: [this.eventTypes, [Validators.required]],
      started_on: [this.started_on, [Validators.required]],
      started_at: [this.started_at, [Validators.required]],
      finished_on: [this.finished_on, []],
      finished_at: [this.finished_at, []],
    });
    this.eventTypeSub = this.eventTypeService.eventTypes$.subscribe({
      next: eventTypes => this.eventTypes = eventTypes
    })
    this.isChanged = !this.data.isEdit
  }

  ngOnDestroy(): void {
    this.eventTypeSub.unsubscribe()
    this.saveEventSub.unsubscribe()
  }

  currentTime(min: number = 0): string {
    return DateTime.now().plus({minutes: min}).toFormat(TIME_FORMAT)
  }

  onSave() {
    if (this.data.entity == null) {
      this.data.entity = new DurationEvent()
    }
    const dateTime = this.getFormDateTime('started')
    if(dateTime === null){
      const msg = 'started_at field must not be null'
      this.logger.error(msg, this.form.get('started_on'), this.form.get('started_at'))
      throw new Error(msg)
    }
    this.data.entity.started_at =  dateTime.toISO()
    this.data.entity.finished_at = this.getFormDateTime('finished')?.toISO() || null
    this.data.entity.event_type_id = this.form.get('event_type')?.value
    const eventType = this.eventTypes.find(x => x.id == this.data.entity.event_type_id)
    if(!eventType){
      throw new Error(`Cannot find event_type by id '${this.data.entity.event_type_id}'`)
    }
    this.data.entity.color = eventType.color
    this.saveEventSub = this.eventService.saveEvent(this.data.entity)
                            .subscribe({
                              next: () => {
                                this.dialogRef.close(new EventOfDayModel<DurationEvent>(this.data.entity, dateTime));
                              },
                              error: error => {
                                this.logger.error('failed to save an occurrence event: ', error, this.data.entity)
                                this.dialogRef.disableClose = true;
                              }
                            });
  }

  getFormDateTime(prefix: string): DateTime | null {
    const fieldValue = this.form.get(`${prefix}_on`)?.value
    if(fieldValue === null){
      return null
    }
    const dateTimeStr = fieldValue?.toISODate()
    const date = DateTime.fromISO(dateTimeStr)
    const time = this.form.get(`${prefix}_at`)?.value.split(':')
    return date?.plus({hours: time[0], minutes: time[1]}) || null
  }
}
