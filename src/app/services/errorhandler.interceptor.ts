import { Injectable } from "@angular/core";
import {
    HttpInterceptor,
    HttpRequest,
    HttpErrorResponse,
    HttpHandler,
    HttpEvent
} from "@angular/common/http";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { Router, NavigationExtras } from "@angular/router";
import { KeycloakService } from "../keycloak/keycloak.service";

declare var $: any;
@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {
    constructor(
        private router: Router
    ) { console.log("HTTP INTERCEPTOR") }

    warningNotification(warningMessage: any) {
        $.notifyClose();
        $.notify({
            icon: 'error',
            message: warningMessage,
        },
            {
                type: 'warning',
                timer: 4000,
                placement: {
                    from: 'top',
                    align: 'center'
                }
            });
    }

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            tap(
                (event: HttpEvent<any>) => { },
                (err: any) => {
                    console.log("In ERROR Handler Interceptor");
                    if (err instanceof HttpErrorResponse) {
                        if (err.status === 401||err.status === 403) {
                            console.log("Inside logout method");
                            KeycloakService.logout();
                        }
                        this.warningNotification(err.error.message);
                    }
                    if (err.status === 0) {
                        KeycloakService.logout();
                    }
                    console.log(err);
                }
            )
        );

    }
}
