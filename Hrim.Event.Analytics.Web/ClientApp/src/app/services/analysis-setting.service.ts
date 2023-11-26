import {Injectable} from "@angular/core";
import {LogService} from "./log.service";
import {Observable, Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {BackendUrlService} from "./backend-url.service";
import {AnyEventTypeAnalysisSettings} from "../shared/event-type-analysis-settings";
import {AnalysisFeatureModel} from "../shared/analysis-feature.model";

@Injectable({providedIn: 'root'})
export class AnalysisSettingService {
  availableAnalysis$ = new Subject<AnalysisFeatureModel[]>();

  analysisUrl = 'v1/analysis'

  constructor(private logger: LogService,
              private urlService: BackendUrlService,
              private http: HttpClient) {
    logger.logConstructor(this);
  }

  loadAvailable() {
    this.http.get<AnalysisFeatureModel[]>(`${this.urlService.crudApiUrl}/${this.analysisUrl}`, {withCredentials: true})
        .subscribe({
          next: availableFeatures => {
            this.logger.debug('List of available features is loaded from server:', availableFeatures)
            this.availableAnalysis$.next(availableFeatures);
          }
        });
  }

  get(entityId: number | string): Observable<AnyEventTypeAnalysisSettings[]> {
    const url = `${this.urlService.crudApiUrl}/${this.analysisUrl}/event-type/${entityId}`
    return this.http.get<AnyEventTypeAnalysisSettings[]>(url, {withCredentials: true})
  }

  save(entityId: number | string, analysisSettings: AnyEventTypeAnalysisSettings[]) {
    this.logger.debug(`saving analysis settings for event type ${entityId}`, analysisSettings)
    const url = `${this.urlService.crudApiUrl}/${this.analysisUrl}/event-type/${entityId}`
    this.http.post<AnyEventTypeAnalysisSettings[]>(url, analysisSettings, {withCredentials: true})
      .subscribe({
        next: () => this.logger.debug(`successfully saved analysis settings for event type ${entityId}`),
        error: err => this.logger.error(`failed to save analysis settings for event type ${entityId}`, analysisSettings, err)
      })
  }
}
