import {Component} from '@angular/core';
import {LogService} from "../services/log.service";

@Component({
  selector: 'app-year-view',
  templateUrl: './year-view.component.html'
})
export class YearViewComponent {

  constructor(private logger: LogService) {
    logger.logConstructor(this)
  }
}
