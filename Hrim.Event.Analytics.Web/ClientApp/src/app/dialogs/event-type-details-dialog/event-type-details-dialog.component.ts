import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {LogService} from "../../services/log.service";
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {EventTypeService} from "../../services/user-event-type.service";
import {Color} from "@angular-material-components/color-picker";
import {debounceTime, distinctUntilChanged, Subject, Subscription} from "rxjs";
import {UserEventType} from "../../shared/event-type.model";
import {EventTypeDetailsDialogRequest} from "../../shared/dialogs/event-type-details-dialog-request";
import {HrimEventService} from "../../services/hrim-event.service";
import {AnalysisSettingService} from "../../services/analysis-setting.service";
import {AnyEventTypeAnalysisSettings} from "../../shared/event-type-analysis-settings";

@Component({
  selector   : 'app-event-type-details-dialog',
  templateUrl: './event-type-details-dialog.component.html',
  styleUrls  : ['./event-type-details-dialog.component.css']
})
export class EventTypeDetailsDialog implements OnInit, OnDestroy {
  isReadOnly: boolean = false
  isChanged: boolean = false
  form: FormGroup
  analysisSettings: AnyEventTypeAnalysisSettings[] = []
  isAnalysisSettingsCreated = false
  isAnalysisSettingsChanged = false
  isAnalysisSettingsNotEmpty= false
  isAnalysisReportsNotEmpty = false
  parentEventTypeOptions: UserEventType[]
  allEventTypes: UserEventType[]
  parentEventTypeSearch: string = ''
  selectedParentEventType: UserEventType | undefined
  parentEventTypeFilter$ = new Subject<any>()

  formValueChangeSub: Subscription
  allEventTypesSub: Subscription
  parentEventTypeFilterSub: Subscription

  private originalEventType: UserEventType;

  constructor(@Inject(MAT_DIALOG_DATA) public data: EventTypeDetailsDialogRequest,
              private dialogRef: MatDialogRef<EventTypeDetailsDialog>,
              private formBuilder: FormBuilder,
              private eventService: HrimEventService,
              private eventTypeService: EventTypeService,
              private analysisSettingService: AnalysisSettingService,
              private logger: LogService) {
    logger.logConstructor(this);
    this.originalEventType = {...this.data.model}
    this.isAnalysisReportsNotEmpty = data.model.analysis_results && data.model.analysis_results.length > 0
  }

  ngOnDestroy(): void {
    this.formValueChangeSub?.unsubscribe()
    this.allEventTypesSub?.unsubscribe()
  }

  ngOnInit(): void {
    this.parentEventTypeFilterSub == this.parentEventTypeFilter$
                                         .pipe(debounceTime(200),
                                               distinctUntilChanged())
                                         .subscribe({
                                           next: event => this.filterEventTypeOptions(this.allEventTypes, event?.target?.value ?? '')
                                         })
    this.allEventTypesSub = this.eventTypeService.eventTypes$
                                .subscribe({
                                  next: eventTypes => {
                                    this.allEventTypes = this.data.model.id
                                       ? eventTypes.filter(x => x.id != this.data.model.id)
                                       : eventTypes
                                    this.selectedParentEventType = this.data.model.parent_id
                                      ? this.allEventTypes.find(x => x.id == this.data.model.parent_id)
                                      : undefined
                                    this.filterEventTypeOptions(this.allEventTypes, this.parentEventTypeSearch)
                                    this.logger.log('getting event types for select component: ', this.allEventTypes)
                                  }
                                })
    this.isReadOnly = !!this.data.model.id && !this.data.model.is_mine;
    this.logger.debug('event type dialog isReadOnly', this.isReadOnly, this.data)
    const color = this.getColorFromHex(this.data.model.color || '#83ee84');
    this.form = this.formBuilder.group({
      name       : [this.data.model.name || '', [Validators.required]],
      description: [this.data.model.description || ''],
      color      : new FormControl(color, [Validators.required]),
      parent     : [this.selectedParentEventType?.name]
    });
    if (this.data.model.id && this.data.model.is_mine) {
      this.eventTypeService.getDetails(this.data.model.id)
          .subscribe({
            next: loadedEventType => {
              this.logger.debug('User event type details was successfully loaded: ', loadedEventType)
              this.data.model = loadedEventType
              this.originalEventType = {...loadedEventType};
            }
          })
    }
    this.formValueChangeSub = this.form.valueChanges
                                  .pipe(debounceTime(500))
                                  .subscribe(() => this.checkFormChanges())
    this.isAnalysisSettingsCreated = !this.data.model.id
    this.analysisSettingService
        .get(this.data.model.id || 0)
        .subscribe({
          next : settings => {
            this.analysisSettings = settings
            this.isAnalysisSettingsNotEmpty = settings && settings.length > 0
          },
          error: err => this.logger.error(`Failed to load analysis settings for event type id ${this.data.model.id}`, err)
        })
    this.analysisSettingService.loadAvailable()
  }

  onEventTypeSelected(event: any){
    this.selectedParentEventType = event.option.value
  }
  private filterEventTypeOptions(allEventTypes: UserEventType[], filter: string){
    const lowerFilter = filter.toLowerCase()
    this.parentEventTypeOptions = filter
      ? allEventTypes.filter(x => x.name.toLowerCase().indexOf(lowerFilter) > -1)
      : allEventTypes
  }
  checkFormChanges() {
    this.isChanged = this.originalEventType.name !== this.form.get('name')?.value ||
      this.originalEventType.description !== this.form.get('description')?.value ||
      this.originalEventType.color !== '#' + this.form.get('color')?.value?.hex ||
      this.originalEventType.parent_id != (this.form.get('parent')?.value?.id ?? 0) ||
      this.isAnalysisSettingsChanged;
    this.logger.debug(`${this.data.title.toLowerCase()} form is changed: `, this.isChanged)
  }

  updateModelFromControls(model: UserEventType) {
    model.name = this.form.get('name')?.value;
    model.color = '#' + this.form.get('color')?.value.hex;
    model.description = this.form.get('description')?.value;
    model.parent_id   = this.form.get('parent')?.value?.id;
  }

  onAnalysisSettingsChanged(isChanged: boolean) {
    this.logger.debug(`analysis settings changed ${isChanged}`, this.data.model.id)
    this.isAnalysisSettingsChanged = isChanged
    this.checkFormChanges()
  }

  onSave() {
    this.checkFormChanges()
    if (!this.isChanged) {
      this.logger.debug('model is not changed')
      return
    }
    this.updateModelFromControls(this.data.model);
    this.eventTypeService.save(this.data.model)
        .subscribe({
          next : (savedEventType) => {
            savedEventType.is_mine = true
            if (this.isAnalysisSettingsChanged || this.isAnalysisSettingsCreated)
              this.analysisSettingService.save(savedEventType.id, this.analysisSettings)
            this.dialogRef.close(savedEventType);
            this.eventService.updateEventTypesForEvents(savedEventType)
          },
          error: error => {
            this.logger.error('failed to save a user event type: ', error)
            this.dialogRef.disableClose = true;
          }
        });
    this.logger.debug('onSave clicked: ', this.data);
  }

  getColorFromHex(hex: string): Color {
    const red = parseInt(hex.slice(1, 3), 16);
    const green = parseInt(hex.slice(3, 5), 16);
    const blue = parseInt(hex.slice(5, 7), 16);
    return new Color(red, green, blue);
  }

  getColorInputBackground(): string {
    return this.form.get('color')?.value?.rgba
  }
}
