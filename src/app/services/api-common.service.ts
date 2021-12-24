import { Injectable, ViewChild } from '@angular/core';
import { Http, RequestOptions, URLSearchParams, RequestOptionsArgs, ResponseContentType } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/finally';
import { environment } from '../../environments/environment';
import { Headers } from '@angular/http';
import { KeycloakService } from '../keycloak/keycloak.service';

import { AppComponent } from '../app.component';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SpinnerService } from './spinner.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ApiCommonService {
    url = environment.baseUrl;
    token = KeycloakService.getMyToken();


    headers = new HttpHeaders({
        'Authorization': 'Bearer ' + this.token,
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        "X-TENANT-ID": environment.tenantId,
        "realm": environment.realm
    });

    options = { headers: this.headers };


    spinner: any = false;

    constructor(public http: HttpClient, private spinnerService: SpinnerService) {

    }
    get1(endpoint: string, params?: any): Observable<any> {
        // this.spinnerService.showLoader();
        return this.http.get(this.url + endpoint, {
            headers: this.headers,
            responseType: 'blob'
        }).finally(() => {
            // this.spinnerService.hideLoader(); 
        });
    }
    get2(endpoint: string, params?: any): Observable<any> {
        // this.spinnerService.showLoader();
        return this.http.get(this.url + endpoint, this.options).finally(() => {
            // this.spinnerService.hideLoader(); 
        });
    }

    get(endpoint: string, params?: any): Observable<any> {
        // this.spinnerService.showLoader();
        return this.http.get(this.url + endpoint, this.options).finally(() => {
            // this.spinnerService.hideLoader(); 
        });
    }

    post1(endpoint: string, body: any): Observable<any> {
        // this.spinnerService.showLoader();
        return this.http.post(this.url + endpoint, body, {
            headers: this.headers,
            responseType: 'blob'
        }).finally(() => {
            // this.spinnerService.hideLoader();
        });
    }
    post(endpoint: string, body: any): Observable<any> {
        // this.spinnerService.showLoader();
        return this.http.post(this.url + endpoint, body, this.options).finally(() => {
            // this.spinnerService.hideLoader(); 
        });
    }

    put(endpoint: string, body: any): Observable<any> {
        // this.spinnerService.showLoader();
        return this.http.put(this.url + endpoint, body, this.options).finally(() => {
            // this.spinnerService.hideLoader(); 
        });
    }

    delete(endpoint: string): Observable<any> {
        // this.spinnerService.showLoader();
        return this.http.delete(this.url + endpoint, this.options).finally(() => {
            // this.spinnerService.hideLoader(); 
        });
    }

    patch(endpoint: string, body: any): Observable<any> {
        // this.spinnerService.showLoader();
        return this.http.put(this.url + endpoint, body, this.options).finally(() => {
            // this.spinnerService.hideLoader(); 
        });
    }

    postWithFormData(endpoint: string, body: any): Observable<any> {
        // this.spinnerService.showLoader();
        var headers = new HttpHeaders({
            'Authorization': 'Bearer ' + this.token,
            "Accept": "application/json",
            'Access-Control-Allow-Origin': '*',
            "X-TENANT-ID": environment.tenantId,
            "realm": environment.realm
        });
        return this.http.post(this.url + endpoint, body,
            {
                headers: headers,
            }).finally(() => {
                // this.spinnerService.hideLoader();
            });

    }
    putWithFormData(endpoint: string, body: any): Observable<any> {
        // this.spinnerService.showLoader();
        var headers = new HttpHeaders({
            'Authorization': 'Bearer ' + this.token,
            "Accept": "application/json",
            'Access-Control-Allow-Origin': '*',
            "X-TENANT-ID": environment.tenantId,
            "realm": environment.realm
        });
        return this.http.put(this.url + endpoint, body,
            {
                headers: headers,
            }).finally(() => {
                // this.spinnerService.hideLoader(); 
            });
    }
}
