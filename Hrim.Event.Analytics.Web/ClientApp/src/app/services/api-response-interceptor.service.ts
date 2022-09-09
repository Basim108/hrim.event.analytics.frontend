import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {catchError, delay, Observable, retry, throwError, timer} from "rxjs";
import {tap} from "rxjs/operators";
import {LogService} from "./log.service";

export const NUMBER_OR_RETRIES = 3;
export const RETRY_WAIT_COEFFICIENT = 500;
export const TOO_MANY_REQUEST_DELAY = 1000;

@Injectable({providedIn: 'root'})
export class ApiResponseInterceptor implements HttpInterceptor {
  constructor(private logger: LogService) {
    logger.logConstructor(this)
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError(error => {
        const isTooManyRequests = error.status === 429;
        if (isTooManyRequests) {
          return next.handle(request).pipe(
            tap(event => {
              this.logger.info(`too many requests to api; lets wait for ${TOO_MANY_REQUEST_DELAY / 1000} sec., before repeating a request: `,
                event)
            }),
            delay(TOO_MANY_REQUEST_DELAY)
          );
        }
        return throwError(error);
      }),
      retry({
        count: NUMBER_OR_RETRIES,
        delay: (error, value) => {
          switch (error.status) {
            case 400:
            case 403:
            case 500:
              return throwError(error);
          }
          const delay = value * RETRY_WAIT_COEFFICIENT;
          console.debug(`delaying before retry; waiting for: ${delay / 1000} sec.`)
          return timer(delay)
        }
      })
    );
  }
}
