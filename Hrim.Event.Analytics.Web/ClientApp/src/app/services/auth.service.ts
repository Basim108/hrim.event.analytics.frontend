import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject} from "rxjs";
import {LogService} from "./log.service";
import {UserProfileModel} from "../shared/user-profile.model";
import {BackendUrlService} from "./backend-url.service";
import {Router} from "@angular/router";

@Injectable({providedIn: 'root'})
export class AuthService {
  user$ = new BehaviorSubject<UserProfileModel | null>(null);

  constructor(private logger: LogService,
              private urlService: BackendUrlService,
              private router: Router,
              private http: HttpClient) {
    logger.logConstructor(this);
    logger.debug(urlService.crudApiUrl)
    this.checkAuthentication()
  }

  checkAuthentication() {
    this.http
      .get<string>('/account/token', {withCredentials: true})
      .subscribe({
        next: accessToken => localStorage.setItem('accessToken', accessToken),
        error: error => this.logger.error(`failed to get access token: (${error.status}) ${error.message}`, error)
      })
    this.http
      .get<UserProfileModel>('/account/profile/me', {withCredentials: true})
      .subscribe({
        next: userProfile => {
          this.logger.debug('User is authenticated.', userProfile)
          this.user$.next(userProfile)
          const unauthorizedUrlRequest = localStorage.getItem('unauthorized-url-request')
          if (unauthorizedUrlRequest) {
            this.logger.debug('redirecting to previously requested url', unauthorizedUrlRequest)
            this.router.navigateByUrl(unauthorizedUrlRequest)
            localStorage.removeItem('unauthorized-url-request')
          }
        },
        error: error => {
          switch (error.status) {
            case 0:
            case 401:
              this.user$.next(null);
              break;
            default:
              this.logger.error(`failed to get user profile request: (${error.status}) ${error.message}`, error)
          }
        }
      })
  }

  login() {
    localStorage.removeItem('unauthorized-url-request')
    window.location.href = `/account/login?returnUri=${encodeURIComponent(window.location.href)}`
  }

  logout() {
    localStorage.removeItem('unauthorized-url-request')
    window.location.href = `/account/logout?returnUri=/`
  }
}
