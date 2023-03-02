import {Component, Inject, OnInit}          from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription}                       from "rxjs";
import {MAT_DIALOG_DATA, MatDialogRef}      from "@angular/material/dialog";
import {EventTypeService}                   from "../../services/user-event-type.service";
import {LogService}                         from "../../services/log.service";
import {EventDetailsDialogRequest}          from "../../shared/dialogs/event-details-dialog-request";
import {SomeEventModel}                     from "../../shared/some-event.model";
import {HrimEventService}                   from "../../services/hrim-event.service";

@Component({
             selector   : 'app-event-details-dialog',
             templateUrl: './event-details-dialog.component.html',
             styleUrls  : ['./event-details-dialog.component.css']
           })
export class EventDetailsDialog implements OnInit {
  isReadOnly: boolean = false
  isChanged: boolean  = false
  selectedEventTypeId: string
  form: FormGroup

  formValueChangeSub: Subscription
  getDetailsSub: Subscription
  saveEventTypeSub: Subscription

  get eventTypes() {
    return Object.values(this.eventTypeService.typeContexts)
                 .filter(x => !x.isDeleted)
                 .map(x => x.entity)
  }

  private readonly originalModel: SomeEventModel;

  constructor(@Inject(MAT_DIALOG_DATA) public data: EventDetailsDialogRequest,
              private dialogRef: MatDialogRef<EventDetailsDialog>,
              private formBuilder: FormBuilder,
              private eventTypeService: EventTypeService,
              private eventService: HrimEventService,
              private logger: LogService) {
    logger.logConstructor(this)
    this.selectedEventTypeId = this.data.model.eventType.id
    this.originalModel       = structuredClone(this.data.model)
  }

  ngOnDestroy(): void {
    this.formValueChangeSub?.unsubscribe()
    this.getDetailsSub?.unsubscribe()
    this.saveEventTypeSub?.unsubscribe()
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
                                         eventType: [this.selectedEventTypeId || '', [Validators.required]]
                                       });

    this.formValueChangeSub = this.form.valueChanges
                                  .subscribe(() => this.checkFormChanges())
  }

  checkFormChanges() {
    this.isChanged = this.originalModel.eventType.id !== this.selectedEventTypeId
    this.logger.debug(`${this.data.title.toLowerCase()} form is changed: `, this.isChanged)
  }

  updateModelFromControls(model: SomeEventModel) {
    const eventTypeContext = this.eventTypeService.typeContexts[this.selectedEventTypeId]
    model.eventType = eventTypeContext.entity
  }

  onSave() {
    this.updateModelFromControls(this.data.model);
    this.saveEventTypeSub = this.eventService
                                .save(this.data.model)
                                .subscribe({
                                             next: () => {
                                               this.dialogRef.close(this.data.model);
                                             },
                                             error: error => {
                                               this.logger.error('failed to save an event: ', this.data, error)
                                               this.dialogRef.disableClose = true;
                                             }
                                           });
    this.logger.debug('Saving an event: ', this.data);
  }

  onCancel() {
    this.data.model = {...this.originalModel};
    this.logger.debug('onCanceled clicked: ', this.data);
  }
}
