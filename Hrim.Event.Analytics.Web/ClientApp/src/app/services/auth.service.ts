import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Subject} from "rxjs";
import {LogService} from "./log.service";
import {UserProfileModel} from "../shared/user-profile.model";
import {environment} from "../../environments/environment";

@Injectable({providedIn: 'root'})
export class AuthService {
  user = new Subject<UserProfileModel | null>();

  constructor(private logger: LogService, private http: HttpClient) {
    logger.logConstructor(this);
    this.checkAuthentication()
  }

  checkAuthentication() {
    this.http.get<UserProfileModel>(`${environment.apiUrl}/v1/user-profile/me`, {
      withCredentials: true
    }).subscribe({
      next: userProfile => {
        this.logger.debug('User is authenticated.', userProfile)
        this.user.next(userProfile)
      },
      error: error => {
        switch (error.status) {
          case 0:
          case 401:
          case 403:
            this.user.next(null);
            break;
          default:
            this.logger.error(`failed request: (${error.status}) ${error.message}`, error)
        }
      }
    });
  }

  login(idp: 'google' | 'facebook') {
    window.location.href = `${environment.apiUrl}/auth/${idp}/login?returnUri=${encodeURIComponent(window.location.href)}`
  }

  logout() {
    window.location.href = `${environment.apiUrl}/auth/logout?returnUri=${encodeURIComponent(window.location.href)}`
  }
}
