import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
@Injectable()
export class SpinnerService {
    private loaderSource = new BehaviorSubject<boolean>(false);
    currentLoaderState = this.loaderSource.asObservable();
    showLoader(): void {
        this.loaderSource.next(true);

    }

    hideLoader(): void {
        this.loaderSource.next(false);

    }
    getLoaderValue(): Observable<any> {
        return this.loaderSource.asObservable();
    }
}

@Injectable()
export class LoaderInterceptorService implements HttpInterceptor {
    private requests: HttpRequest<any>[] = [];

    constructor(private loaderService: SpinnerService, private router: Router) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        
        if (this.router.url.includes('/dashboard')) { // since dashboard has local loader in widgets we need to bypass global loader for dashboard
            return next.handle(req).pipe(
                finalize(
                    () => {
                        this.loaderService.hideLoader();
                    }
                )
            )
        }
        else {
            if (this.requests.length == 0) this.loaderService.showLoader();
            this.requests.push(req);
            return next.handle(req).pipe(
                finalize(
                    () => {
                        this.requests.pop();
                        if (this.requests.length == 0) this.loaderService.hideLoader();
                    }
                )
            )
        }
    }
}