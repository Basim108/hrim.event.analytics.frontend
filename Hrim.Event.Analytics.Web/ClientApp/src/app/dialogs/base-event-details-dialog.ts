import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription}                       from "rxjs";
import {EventTypeService}                   from "../services/user-event-type.service";
import {HrimEventService}                   from "../services/hrim-event.service";
import {LogService}                         from "../services/log.service";
import {BaseEventModel}                     from "../shared/base-event.model";
import {BaseDetailsDialogRequest}           from "../shared/dialogs/base-details-dialog-request";
import {Component}                          from "@angular/core";
import {SomeEventModel}                     from "../shared/some-event.model";
import {DateTime}                           from "luxon";

export type EventSaveContext = {
  model: SomeEventModel,
  next: () => void | null,
  error: (err: any) => void | null
}

@Component({template: ''})
export abstract class BaseEventDetailsDialog {

  public dialogRequest: BaseDetailsDialogRequest
  protected saveContext: EventSaveContext
  isReadOnly: boolean = false
  isChanged: boolean  = false
  selectedEventTypeId: string
  form: FormGroup

  protected formValueChangeSub: Subscription
  protected saveEventTypeSub: Subscription

  get eventTypes() {
    return Object.values(this.eventTypeService.typeContexts)
                 .filter(x => !x.isDeleted)
                 .map(x => x.entity)
  }

  protected constructor(protected formBuilder: FormBuilder,
                        protected eventTypeService: EventTypeService,
                        protected eventService: HrimEventService,
                        protected logger: LogService) {

  }

  protected abstract get originalBaseEvent(): BaseEventModel

  protected abstract addCustomFormControls(controls: any): void

  protected abstract customUpdateModelFromControls(): void

  protected abstract customFormChangesCheck(): boolean

  ngOnDestroy(): void {
    this.formValueChangeSub?.unsubscribe()
    this.saveEventTypeSub?.unsubscribe()
  }

  ngOnInit(): void {
    let controls = {
      eventType: [this.selectedEventTypeId || '', [Validators.required]],
    }
    this.addCustomFormControls(controls)
    this.form               = this.formBuilder.group(controls);
    this.formValueChangeSub = this.form.valueChanges
                                  .subscribe(() => this.checkFormChanges())
  }

  checkFormChanges() {
    this.isChanged = this.originalBaseEvent.eventType.id !== this.selectedEventTypeId ||
      this.customFormChangesCheck()

    this.logger.debug(`${this.dialogRequest.title.toLowerCase()} form is changed: `, this.isChanged)
  }

  updateModelFromControls() {
    const eventTypeContext           = this.eventTypeService.typeContexts[this.selectedEventTypeId]
    this.saveContext.model.eventType = eventTypeContext.entity
    this.customUpdateModelFromControls()
  }

  onSave() {
    this.checkFormChanges()
    if (!this.isChanged) {
      this.logger.debug('event is not changed')
      return
    }
    this.updateModelFromControls()
    this.saveEventTypeSub = this.eventService
                                .save(this.saveContext.model)
                                .subscribe({
                                             next : this.saveContext.next,
                                             error: err => {
                                               this.logger.error('failed to save an event: ', this.dialogRequest, err)
                                               this.saveContext.error(err)
                                             }
                                           });
    this.logger.debug('Saving an event: ', this.dialogRequest);
  }

  public isDateChanged(original: DateTime | null, fromControl: Date | null): boolean{
    if (!original && fromControl || original && !fromControl)
      return true
    if(!original && !fromControl)
      return false
    const fromControlISO = DateTime.fromJSDate(fromControl!).toISO()
    const originalISO =original!.toISO()
    return  originalISO !== fromControlISO
  }
}
