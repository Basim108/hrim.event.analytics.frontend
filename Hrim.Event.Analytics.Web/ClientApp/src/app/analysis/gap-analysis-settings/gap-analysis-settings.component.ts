import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {EventTypeGapAnalysisSettings} from "../../shared/event-type-analysis-settings";
import {MatSlideToggleChange} from "@angular/material/slide-toggle";
import {debounceTime, distinctUntilChanged, Subject} from "rxjs";
import {tap} from "rxjs/operators";

@Component({
  selector   : 'gap-analysis-settings',
  templateUrl: './gap-analysis-settings.component.html',
  styleUrls  : ['./gap-analysis-settings.component.css']
})
export class GapAnalysisSettingsComponent implements OnInit {
  @Input('settings') analysisInfo: EventTypeGapAnalysisSettings
  @Output() changed = new EventEmitter<boolean>()

  minimalGap$ = new Subject<string>()

  originalSettings: EventTypeGapAnalysisSettings

  constructor() {
  }

  ngOnInit(): void {
    this.originalSettings = new EventTypeGapAnalysisSettings();

    this.originalSettings.is_on = this.analysisInfo.is_on || false
    this.originalSettings.settings = {
      minimal_gap_length: this.analysisInfo.settings.minimal_gap_length
    }
    this.minimalGap$.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      tap(v => console.log('minimal gap has been changed', v))
    ).subscribe(value => this.changed.emit(this.isChanged()))
  }

  onToggle($event: MatSlideToggleChange) {
    this.changed.emit(this.isChanged())
  }

  isChanged() {
    console.log('checking changes minimal gap', this.analysisInfo.settings.minimal_gap_length, this.originalSettings.settings.minimal_gap_length)
    console.log('checking changes is on', this.analysisInfo.is_on, this.originalSettings.is_on)
    return this.analysisInfo.is_on && this.originalSettings.is_on ||
      this.analysisInfo.settings.minimal_gap_length !== this.originalSettings.settings.minimal_gap_length

  }
}
