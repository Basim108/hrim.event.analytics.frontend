import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {LogService} from "../services/log.service";
import {EventTypeService} from "../services/user-event-type.service";
import {Subscription} from "rxjs";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DateTime} from "luxon";
import {HrimEventService} from "../services/hrim-event.service";
import {UserEventType} from "../shared/event-type.model";
import {OccurrenceEvent} from "../shared/events.model";
import {DialogDetailsRequest} from "../shared/dialog-details-request";


const TIME_FORMAT = 'HH:mm'

@Component({
  selector: 'app-event-occurrence-details-dialog',
  templateUrl: './event-occurrence-details-dialog.component.html',
  styleUrls: ['./event-occurrence-details-dialog.component.css']
})
export class EventOccurrenceDetailsDialog implements OnInit, OnDestroy {

  eventTypes: UserEventType[]

  occurred_on: DateTime
  occurred_at: string

  isChanged: boolean = false
  form: FormGroup

  formValueChangeSub: Subscription
  saveEventSub: Subscription
  eventTypeSub: Subscription

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogDetailsRequest<OccurrenceEvent>,
              private dialogRef: MatDialogRef<EventOccurrenceDetailsDialog>,
              private formBuilder: FormBuilder,
              private logger: LogService,
              private eventService: HrimEventService,
              private eventTypeService: EventTypeService) {
    logger.logConstructor(this)
  }

  ngOnInit(): void {
    const additionalControls: any = {};
    this.occurred_on = this.data.entity?.occurred_at
                       ? DateTime.fromISO(this.data.entity?.occurred_at)
                       : DateTime.now()
    this.occurred_at = this.occurred_on.toFormat(TIME_FORMAT)

    additionalControls.occurred_on = [this.occurred_on, [Validators.required]];
    additionalControls.occurred_at = [this.occurred_at, [Validators.required]];

    this.form = this.formBuilder.group({
      event_type: [this.eventTypes, [Validators.required]],
      occurred_on: [this.occurred_on || DateTime.now(), [Validators.required]],
      occurred_at: [this.occurred_at || '', [Validators.required]]
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
      this.data.entity = new OccurrenceEvent()
    }
    this.data.entity.occurred_at = this.getFormDateTime('occurred').toISO()
    this.data.entity.event_type_id = this.form.get('event_type')?.value
    this.saveEventSub = this.eventService.saveEvent(this.data.entity)
                            .subscribe({
                              next: () => {
                                this.dialogRef.close(this.data.entity);
                              },
                              error: error => {
                                this.logger.error('failed to save an occurrence event: ', error, this.data.entity)
                                this.dialogRef.disableClose = true;
                              }
                            });
  }

  getFormDateTime(prefix: string): DateTime {
    const date = this.form.get(`${prefix}_on`)?.value
    const time = this.form.get(`${prefix}_at`)?.value.split(':')
    return date?.plus({hours: time[0], minutes: time[1]}) || null
  }
}
