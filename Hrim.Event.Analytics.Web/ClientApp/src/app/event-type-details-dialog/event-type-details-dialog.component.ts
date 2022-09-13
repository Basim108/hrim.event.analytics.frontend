import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {LogService} from "../services/log.service";
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {EventTypeService} from "../services/user-event-type.service";
import {Color} from "@angular-material-components/color-picker";
import {debounceTime, Subscription} from "rxjs";
import {UserEventType} from "../shared/event-type.model";
import {DialogDetailsRequest} from "../shared/dialog-details-request";

@Component({
  selector: 'app-event-type-details-dialog',
  templateUrl: './event-type-details-dialog.component.html',
  styleUrls: ['./event-type-details-dialog.component.css']
})
export class EventTypeDetailsDialog implements OnInit, OnDestroy {
  isReadOnly: boolean = false
  isChanged: boolean = false
  form: FormGroup

  formValueChangeSub: Subscription
  getDetailsSub: Subscription
  saveEventTypeSub: Subscription

  private originalEventType: UserEventType;

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogDetailsRequest<UserEventType>,
              private dialogRef: MatDialogRef<EventTypeDetailsDialog>,
              private formBuilder: FormBuilder,
              private eventTypeService: EventTypeService,
              private logger: LogService) {
    logger.logConstructor(this);
    this.originalEventType = {...this.data.entity};
  }

  ngOnDestroy(): void {
    this.formValueChangeSub.unsubscribe()
    if (this.getDetailsSub)
      this.getDetailsSub.unsubscribe()
    this.saveEventTypeSub.unsubscribe()
  }

  ngOnInit(): void {
    this.isReadOnly = !!this.data.entity.id && !this.data.entity.is_mine;
    const color = this.getColorFromHex(this.data.entity.color || '#83ee84');
    this.form = this.formBuilder.group({
      name: [this.data.entity.name || '', [Validators.required]],
      description: [this.data.entity.description || ''],
      color: new FormControl(color, [Validators.required])
    });
    if (this.data.entity.id && this.data.entity.is_mine) {
      this.getDetailsSub = this.eventTypeService.getDetails(this.data.entity.id)
                               .subscribe({
                                 next: loadedEventType => {
                                   this.logger.debug('User event type details was successfully loaded: ', loadedEventType)
                                   this.updateModelFromControls(loadedEventType);
                                   this.data.entity = loadedEventType
                                   this.originalEventType = {...loadedEventType};
                                 }
                               })
    }
    this.formValueChangeSub = this.form.valueChanges
                                  .pipe(debounceTime(500))
                                  .subscribe(() => this.checkFormChanges())
  }

  checkFormChanges() {
    this.isChanged = this.originalEventType.name !== this.form.get('name')?.value ||
      this.originalEventType.description !== this.form.get('description')?.value ||
      this.originalEventType.color !== '#' + this.form.get('color')?.value?.hex;
    this.logger.debug(`${this.data.title.toLowerCase()} form is changed: `, this.isChanged)
  }

  updateModelFromControls(model: UserEventType) {
    model.name = this.form.get('name')?.value;
    model.color = '#' + this.form.get('color')?.value.hex;
    model.description = this.form.get('description')?.value;
  }

  onSave() {
    this.updateModelFromControls(this.data.entity);
    this.saveEventTypeSub = this.eventTypeService.saveEventType(this.data.entity)
                                .subscribe({
                                  next: () => {
                                    this.dialogRef.close(this.data.entity);
                                  },
                                  error: error => {
                                    this.logger.error('failed to save a user event type: ', error)
                                    this.dialogRef.disableClose = true;
                                  }
                                });
    this.logger.debug('onSave clicked: ', this.data);
  }

  onCancel() {
    this.data.entity = {...this.originalEventType};
    this.logger.debug('Cancel event type details dialog.', this.data);
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
