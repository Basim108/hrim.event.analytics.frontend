import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {EventTypeCountAnalysisSettings} from "../../shared/event-type-analysis-settings";
import {MatSlideToggleChange} from "@angular/material/slide-toggle";
import {LogService} from "../../services/log.service";

@Component({
  selector: 'count-analysis-settings',
  templateUrl: './count-analysis-settings.component.html',
  styleUrls: ['./count-analysis-settings.component.css']
})
export class CountAnalysisSettingsComponent implements OnInit {
  @Input('settings') analysisInfo: EventTypeCountAnalysisSettings
  @Output() changed = new EventEmitter<boolean>()

  originalSettings: EventTypeCountAnalysisSettings

  constructor(private logger: LogService) {
    logger.logConstructor(this)
  }
  ngOnInit(): void {
    this.originalSettings = {...this.analysisInfo, is_on: this.analysisInfo.is_on || false}
  }

  onToggle($event: MatSlideToggleChange){
    this.changed.emit($event.checked !== this.originalSettings.is_on)
  }
}
