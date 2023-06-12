import {Injectable} from '@angular/core';
import {LogService} from "./log.service";
import {HttpClient} from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class BackendUrlService {

    constructor(private logger: LogService, private http: HttpClient) {
        logger.logConstructor(this);
        this.http
            .get<string>('/backend/crud', {withCredentials: true})
            .subscribe({
                next: crudApiUrl => localStorage.setItem('crudApiUrl', crudApiUrl),
                error: error => this.logger.error(`failed to get crudApiUrl: (${error.status}) ${error.message}`, error)
            })
    }
    
    get crudApiUrl(): string {
        return localStorage.getItem('crudApiUrl') || ''
    }
}
