import { Component } from '@angular/core';
import {LogService} from "./services/log.service";
import {environment} from "../environments/environment";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Hrim Events';

  constructor(private logger: LogService) {
    logger.logConstructor(this);
    logger.debug(`current environment: ${environment.environmentName}`, environment)
  }
}
