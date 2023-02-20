import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../services/auth.service";
import {LogService} from "../services/log.service";
import {Subscription} from "rxjs";
import {UserProfileModel} from "../shared/user-profile.model";

@Component({
  selector: 'app-auth-menu',
  templateUrl: './auth-menu.component.html',
  styleUrls: ['./auth-menu.component.css']
})
export class AuthMenuComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  isAuthenticatedSub: Subscription;
  user: UserProfileModel | null = null;

  constructor(private authService: AuthService,
              private logger: LogService) {
    logger.logConstructor(this);
  }

  ngOnInit(): void {
    this.isAuthenticatedSub = this.authService.user$.subscribe(user => {
      this.isAuthenticated = !!user
      this.user = user;
      this.logger.debug('got user:', user)
    });
  }

  ngOnDestroy() {
    this.isAuthenticatedSub?.unsubscribe();
  }

  onGoogleLogin() {
    this.authService.login('google');
  }

  onFacebookLogin() {
    this.authService.login('facebook');
  }

  onLogout() {
    this.authService.logout()
  }
}
