import {Injectable}                                           from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable}                                           from "rxjs";

@Injectable({providedIn: 'root'})
export class ApiRequestInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const accessToken            = localStorage.getItem('accessToken')
        const isNotAccountController = !request.url.startsWith("/account")
        if (isNotAccountController && accessToken) {
            request = request.clone({
                                        setHeaders: {
                                            'Content-Type' : 'application/json; charset=utf-8',
                                            'Accept'       : 'application/json',
                                            'Authorization': `Bearer ${accessToken}`,
                                        },
                                    });
        }
        return next.handle(request);
    }
}