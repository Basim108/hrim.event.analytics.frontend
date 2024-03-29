import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef}        from "@angular/material/dialog";
import {EventTypeService}                     from "../../services/user-event-type.service";
import {LogService}                           from "../../services/log.service";
import {HrimEventService}                     from "../../services/hrim-event.service";
import {OccurrenceEventModel}                 from "../../shared/occurrence-event.model";
import {OccurrenceEventDetailsDialogRequest}  from "../../shared/dialogs/occurrence-event-details-dialog-request";
import {DateTime}                             from "luxon";
import {BaseEventDetailsDialog}               from "../base-event-details-dialog";
import {BaseEventModel}                       from "../../shared/base-event.model";
import {NotificationService} from "../../services/notification.service";

@Component({
             selector   : 'app-occurrence-event-details-dialog',
             templateUrl: './occurrence-event-details-dialog.html',
             styleUrls  : ['./occurrence-event-details-dialog.css']
           })
export class OccurrenceEventDetailsDialog extends BaseEventDetailsDialog implements OnDestroy, OnInit {

  private readonly originalModel: OccurrenceEventModel;

  constructor(@Inject(MAT_DIALOG_DATA) public override dialogRequest: OccurrenceEventDetailsDialogRequest,
              public dialogRef: MatDialogRef<OccurrenceEventDetailsDialog>,
              formBuilder: FormBuilder,
              eventTypeService: EventTypeService,
              eventService: HrimEventService,
              notificationService: NotificationService,
              logger: LogService) {
    super(formBuilder, eventTypeService, eventService, notificationService, logger)
    logger.logConstructor(this)
    this.saveContext         = {
      model: this.dialogRequest.model,
      next : savedEvent => {
        this.dialogRef.close(savedEvent)
      },
      error: () => {
        this.dialogRef.disableClose = true
      }
    }
    this.selectedEventTypeId = this.dialogRequest.model.eventType.id
    this.originalModel       = {...this.dialogRequest.model}
  }

  protected get originalBaseEvent(): BaseEventModel {
    return this.originalModel
  }

  protected addCustomFormControls(controls: any): void {
    controls.from = new FormControl(this.dialogRequest.model.occurredAt.toISO(), [Validators.required])
  }

  protected customFormChangesCheck(): boolean {
    const from = this.form.get('from')?.value
    return this.isDateChanged(this.originalModel.occurredAt, from)
  }

  protected customUpdateModelFromControls(): void {
    const from                          = this.form.get('from')?.value
    this.dialogRequest.model.occurredAt = typeof (from) === 'string'
                                          ? DateTime.fromISO(from)
                                          : DateTime.fromJSDate(from)
    this.dialogRequest.model.occurredOn = this.dialogRequest.model.occurredAt.toISODate() ?? ''
  }
}
