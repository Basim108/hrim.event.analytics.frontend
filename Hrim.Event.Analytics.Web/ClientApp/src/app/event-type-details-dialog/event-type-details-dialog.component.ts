import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {LogService} from "../services/log.service";
import {EventTypeDetailsRequest} from "./event-type-details-request";
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {EventTypeService} from "../services/user-event-type.service";
import {Color} from "@angular-material-components/color-picker";
import {debounceTime, Subscription} from "rxjs";
import {UserEventType} from "../event-type-item/event-type.model";

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

  constructor(@Inject(MAT_DIALOG_DATA) public data: EventTypeDetailsRequest,
              private dialogRef: MatDialogRef<EventTypeDetailsDialog>,
              private formBuilder: FormBuilder,
              private eventTypeService: EventTypeService,
              private logger: LogService) {
    logger.logConstructor(this);
    this.originalEventType = {...this.data.eventType};
  }

  ngOnDestroy(): void {
    this.formValueChangeSub?.unsubscribe()
    this.getDetailsSub?.unsubscribe()
    this.saveEventTypeSub?.unsubscribe()
  }

  ngOnInit(): void {
    this.isReadOnly = !!this.data.eventType.id && !this.data.eventType.is_mine;
    const color = this.getColorFromHex(this.data.eventType.color || '#83ee84');
    this.form = this.formBuilder.group({
      name: [this.data.eventType.name || '', [Validators.required]],
      description: [this.data.eventType.description || ''],
      color: new FormControl(color, [Validators.required])
    });
    if (this.data.eventType.id && this.data.eventType.is_mine) {
      this.getDetailsSub = this.eventTypeService.getDetails(this.data.eventType.id)
                               .subscribe({
                                 next: loadedEventType => {
                                   this.logger.debug('User event type details was successfully loaded: ', loadedEventType)
                                   this.updateModelFromControls(loadedEventType);
                                   this.data.eventType = loadedEventType
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
    this.updateModelFromControls(this.data.eventType);
    this.saveEventTypeSub = this.eventTypeService.saveEventType(this.data.eventType)
                                .subscribe({
                                  next: () => {
                                    this.dialogRef.close(this.data.eventType);
                                  },
                                  error: error => {
                                    this.logger.error('failed to save a user event type: ', error)
                                    this.dialogRef.disableClose = true;
                                  }
                                });
    this.logger.debug('onSave clicked: ', this.data);
  }

  onCancel() {
    this.data.eventType = {...this.originalEventType};
    this.logger.debug('onCanceled clicked: ', this.data);
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
