import {Component} from '@angular/core';
import {LogService} from "./services/log.service";
import {environment} from "../environments/environment";
import {BackendUrlService} from "./services/backend-url.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent {
    title = 'Hrim Events';

    constructor(private logger: LogService,
                private urlService: BackendUrlService) {
        logger.logConstructor(this);
        logger.debug(`current environment: ${environment.environmentName}`, environment)
        logger.debug('fetching the crudApiUrl', urlService.crudApiUrl)
    }
}
