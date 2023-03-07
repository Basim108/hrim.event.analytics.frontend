import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef}        from "@angular/material/dialog";
import {EventTypeService}                     from "../../services/user-event-type.service";
import {LogService}                           from "../../services/log.service";
import {HrimEventService}                     from "../../services/hrim-event.service";
import {DurationEventModel}                   from "../../shared/duration-event.model";
import {DurationEventDetailsDialogRequest}    from "../../shared/dialogs/duration-event-details-dialog-request";
import {DateTime}                             from "luxon";
import {BaseEventDetailsDialog}               from "../base-event-details-dialog";
import {BaseEventModel}                       from "../../shared/base-event.model";

@Component({
             selector   : 'app-duration-event-details-dialog',
             templateUrl: './duration-event-details-dialog.html',
             styleUrls  : ['./duration-event-details-dialog.css']
           })
export class DurationEventDetailsDialog extends BaseEventDetailsDialog implements OnDestroy, OnInit {

  private readonly originalModel: DurationEventModel;

  constructor(@Inject(MAT_DIALOG_DATA) public override dialogRequest: DurationEventDetailsDialogRequest,
              private dialogRef: MatDialogRef<DurationEventDetailsDialog>,
              formBuilder: FormBuilder,
              eventTypeService: EventTypeService,
              eventService: HrimEventService,
              logger: LogService) {
    super(formBuilder, eventTypeService, eventService, logger)
    logger.logConstructor(this)
    this.saveContext         = {
      model: this.dialogRequest.model,
      next : () => this.dialogRef.close(this.dialogRequest.model),
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
    controls.from = new FormControl(this.dialogRequest.model.startedAt.toISO(), [Validators.required])
    controls.to   = new FormControl(this.dialogRequest.model.finishedAt?.toISO() ?? null)
  }

  protected customFormChangesCheck(): boolean {
    const startedAt  = this.form.get('from')?.value
    const finishedAt = this.form.get('to')?.value
    return this.isDateChanged(this.originalModel.startedAt, startedAt) ||
      this.isDateChanged(this.originalModel.finishedAt, finishedAt)
  }

  protected customUpdateModelFromControls(): void {
    const startedAt                    = this.form.get('from')?.value
    const finishedAt                   = this.form.get('to')?.value
    this.dialogRequest.model.startedAt = DateTime.fromJSDate(startedAt)
    this.dialogRequest.model.startedOn = this.dialogRequest.model.startedAt.toISODate()
    if (finishedAt) {
      this.dialogRequest.model.finishedAt = DateTime.fromJSDate(finishedAt)
      this.dialogRequest.model.finishedOn = this.dialogRequest.model.finishedAt.toISODate()
    } else {
      this.dialogRequest.model.finishedAt = null
      this.dialogRequest.model.finishedOn = null
    }
  }
}
