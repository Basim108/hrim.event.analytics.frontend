import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {LogService} from "../../services/log.service";
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {EventTypeService} from "../../services/user-event-type.service";
import {Color} from "@angular-material-components/color-picker";
import {debounceTime, Subscription} from "rxjs";
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
  isAnalysisSettingsChanged = false

  formValueChangeSub: Subscription

  private originalEventType: UserEventType;

  constructor(@Inject(MAT_DIALOG_DATA) public data: EventTypeDetailsDialogRequest,
              private dialogRef: MatDialogRef<EventTypeDetailsDialog>,
              private formBuilder: FormBuilder,
              private eventService: HrimEventService,
              private eventTypeService: EventTypeService,
              private analysisSettingService: AnalysisSettingService,
              private logger: LogService) {
    logger.logConstructor(this);
    this.originalEventType = {...this.data.model};
  }

  ngOnDestroy(): void {
    this.formValueChangeSub?.unsubscribe()
  }

  ngOnInit(): void {
    this.isReadOnly = !!this.data.model.id && !this.data.model.is_mine;
    this.logger.debug('event type dialog isReadOnly', this.isReadOnly, this.data)
    const color = this.getColorFromHex(this.data.model.color || '#83ee84');
    this.form = this.formBuilder.group({
      name       : [this.data.model.name || '', [Validators.required]],
      description: [this.data.model.description || ''],
      color      : new FormControl(color, [Validators.required])
    });
    if (this.data.model.id && this.data.model.is_mine) {
      this.eventTypeService.getDetails(this.data.model.id)
          .subscribe({
            next: loadedEventType => {
              this.logger.debug('User event type details was successfully loaded: ', loadedEventType)
              this.updateModelFromControls(loadedEventType);
              this.data.model = loadedEventType
              this.originalEventType = {...loadedEventType};
            }
          })
    }
    this.formValueChangeSub = this.form.valueChanges
                                  .pipe(debounceTime(500))
                                  .subscribe(() => this.checkFormChanges())
    this.analysisSettingService
        .get(this.data.model.id)
        .subscribe({
          next : settings => {
            this.analysisSettings = settings
          },
          error: err => this.logger.error(`Failed to load analysis settings for event type id ${this.data.model.id}`, err)
        })
    this.analysisSettingService.loadAvailable()
  }

  checkFormChanges() {
    this.isChanged = this.originalEventType.name !== this.form.get('name')?.value ||
      this.originalEventType.description !== this.form.get('description')?.value ||
      this.originalEventType.color !== '#' + this.form.get('color')?.value?.hex ||
      this.isAnalysisSettingsChanged;
    this.logger.debug(`${this.data.title.toLowerCase()} form is changed: `, this.isChanged)
  }

  updateModelFromControls(model: UserEventType) {
    model.name = this.form.get('name')?.value;
    model.color = '#' + this.form.get('color')?.value.hex;
    model.description = this.form.get('description')?.value;
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
            this.dialogRef.close(savedEventType);
            this.eventService.updateEventTypesForEvents(savedEventType)
          },
          error: error => {
            this.logger.error('failed to save a user event type: ', error)
            this.dialogRef.disableClose = true;
          }
        });
    if (this.isAnalysisSettingsChanged)
      this.analysisSettingService.save(this.data.model.id, this.analysisSettings)
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
