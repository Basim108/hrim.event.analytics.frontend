import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {Injectable} from "@angular/core";
import {map, Observable, take} from "rxjs";
import {AuthService} from "./auth.service";
import {LogService} from "./log.service";

@Injectable({providedIn: "root"})
export class AuthGuard implements CanActivate {
  constructor(private logger: LogService,
              private authService: AuthService,
              private router: Router) {
    logger.logConstructor(this)
  }

  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.user$.pipe(
        take(1),
        map(user => {
          if (user) {
            this.logger.debug('auth guard passes the route for the user')
            return true;
          }
          this.logger.warn('auth guard blocks the route for the user')
          return this.router.createUrlTree(['/']);
        }));
  }
}
