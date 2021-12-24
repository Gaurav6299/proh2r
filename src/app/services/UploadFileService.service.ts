import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpParams, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ApiCommonService } from './api-common.service';
import { environment } from '../../environments/environment';
import { KeycloakService } from '../keycloak/keycloak.service';
import { Http } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


@Injectable()
export class UploadFileService {
  url = environment.baseUrl;
  token = 'Bearer ' + KeycloakService.getMyToken();


  headers = new Headers({
    'Authorization': 'Bearer ' + this.token,
    'Content-Type': 'application/json',
    "X-TENANT-ID": environment.tenantId,
    "realm": environment.realm
  });

  constructor(private http: HttpClient, private apiCommonService: ApiCommonService, private htt1: Http) {
  }

  pushFileToStorage(file: File, url: string, uploadType?: any, name?: any): Observable<HttpEvent<{}>> {
    let formdata: FormData = new FormData();
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', this.token);
    headers = headers.append('realm', environment.realm);
    headers = headers.append('X-TENANT-ID', environment.tenantId);
    if (uploadType === "profile") {
      formdata.append('file', file, 'profile-picture.jpeg')
    } else if (uploadType === "org") {
      formdata.append('file', file, name)
    } else {
      formdata.append('file', file);
    }

    const empCode = 1122;
    const req = new HttpRequest('POST', environment.baseUrl + url, formdata, {
      headers: headers,
      // reportProgress: true,
      // responseType: 'text'
    });
    return this.http.request(req);
  }

  pushFileToStorage2(file: File, url: string, uploadType?: any): Observable<HttpEvent<{}>> {
    let formdata: FormData = new FormData();
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', this.token);
    headers = headers.append('realm', environment.realm);
    headers = headers.append("X-TENANT-ID", environment.tenantId);
    uploadType === "profile" ? formdata.append('file', file, 'profile-picture.jpeg') : formdata.append('file', file);
    const req = new HttpRequest('POST', environment.baseUrl + url, formdata, {
      headers: headers,
      reportProgress: true,
      responseType: 'text'
    });
    return this.http.request(req);
  }
  // getFileToStorage(file: File, url: string): Observable<HttpEvent<{}>> {
  //   let formdata:form
  // }
  deleteFileToStorage(file: File, url: string): Observable<HttpEvent<{}>> {
    let formdata: FormData = new FormData();
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', this.token);
    headers = headers.append('realm', environment.realm);
    headers = headers.append('X-TENANT-ID', environment.tenantId);
    formdata.append('file', file);
    const req = new HttpRequest('DELETE', environment.baseUrl + url, formdata, {
      headers: headers,
      reportProgress: true,
      responseType: 'text'
    });
    return this.http.request(req);
  }

  pushBodyWithFileToStorage(
    url: string,
    formdata: FormData,
    documentName: string,
    documentDescription: string,
    accessLevel: string,
    employeeType: string,
    selectedEmployee: string
  ): Observable<HttpEvent<{}>> {


    const param = new HttpParams();
    const body = {
      url: url,
      formdata: formdata,
      documentName: documentName,
      documentDescription: documentDescription,
      accessLevel: accessLevel,
      employeeType: employeeType,
      selectedEmployee: selectedEmployee
    };
    param.append('url', url);
    param.append('documentName', documentName);
    param.append('documentDescription', documentDescription);
    param.append('accessLevel', accessLevel);
    param.append('employeeType', employeeType);
    param.append('selectedEmployee', selectedEmployee);


    let headers = new HttpHeaders();
    headers = headers.append('Authorization', this.token);
    headers = headers.append('realm', environment.realm);
    headers = headers.append('X-TENANT-ID', environment.tenantId);
    // headers = headers.append('Content-Type', 'application/json;');
    const req = new HttpRequest('POST', environment.baseUrl + url +
      '?documentName=' + documentName
      + '&documentDescription=' + documentDescription
      + '&accessLevel=' + accessLevel
      + '&employeeType=' + employeeType
      + '&seletedEmployee=' + selectedEmployee + '', formdata, {
      headers: headers,
      reportProgress: true,
      params: param,
      responseType: 'text'
    });

    // return this.apiCommonService.post('/post', formdata);


    return this.http.request(req);
  }

  public deleteFile() {
    return this.apiCommonService.delete('');
  }
  putBodyWithFileToStorage(
    url: string,
    compPolicyDocId: any,
    documentName: string,
    documentDescription: string,
    accessLevel: string,
    employeeType: string,
    selectedEmployee: string
  ): Observable<HttpEvent<{}>> {

    const param = new HttpParams();
    const body = {
      url: url,
      compPolicyDocId: compPolicyDocId,
      documentName: documentName,
      documentDescription: documentDescription,
      accessLevel: accessLevel,
      employeeType: employeeType,
      selectedEmployee: selectedEmployee
    };
    param.append('url', url);
    param.append('empDocRecordId', compPolicyDocId);
    param.append('documentName', documentName);
    param.append('documentDescription', documentDescription);
    param.append('accessLevel', accessLevel);
    param.append('employeeType', employeeType);
    param.append('selectedEmployee', selectedEmployee);

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', this.token);
    headers = headers.append('realm', environment.realm);
    headers = headers.append('X-TENANT-ID', environment.tenantId);
    // headers = headers.append('Content-Type', 'application/json;');
    const req = new HttpRequest('PUT', environment.baseUrl + url + compPolicyDocId
      + '?documentName=' + documentName
      + '&documentDescription=' + documentDescription
      + '&accessLevel=' + accessLevel
      + '&employeeType=' + employeeType
      + '&seletedEmployee=' + selectedEmployee, + '', {
      headers: headers,
      reportProgress: true,
      params: param,
      responseType: 'text'
    });

    return this.http.request(req);
  }

  //put body to service 
  // putBodyWithFileToStorage(
  //   url: string,
  //   compPolicyDocId: any,
  //   formdata: FormData,
  //   documentName: string,
  //   documentDescription: string,
  //   accessLevel: string,
  //   employeeType: string,
  //   selectedEmployee: string
  // ): Observable<HttpEvent<{}>> {

  //   let param = new HttpParams();
  //   const body = {
  //     url: url,
  //     compPolicyDocId: compPolicyDocId,
  //     formdata: formdata,
  //     documentName: documentName,
  //     documentDescription: documentDescription,
  //     accessLevel: accessLevel,
  //     employeeType: employeeType,
  //     selectedEmployee: selectedEmployee
  //   }
  //   param.append('url', url);
  //   param.append('empDocRecordId', compPolicyDocId);
  //   param.append('documentName', documentName);
  //   param.append('documentDescription', documentDescription);
  //   param.append('accessLevel', accessLevel);
  //   param.append('employeeType', employeeType);
  //   param.append('selectedEmployee', selectedEmployee);

  //   let headers = new HttpHeaders();
  //   headers = headers.append('Authorization', this.token);
  //   // headers = headers.append('Content-Type', 'application/json;');
  //   const req = new HttpRequest('PUT', environment.baseUrl + url + compPolicyDocId
  //     + '?documentName=' + documentName
  //     + '&documentDescription=' + documentDescription
  //     + '&accessLevel=' + accessLevel
  //     + '&employeeType=' + employeeType
  //     + '&seletedEmployee=' + selectedEmployee + '', formdata, {
  //       headers: headers,
  //       reportProgress: true,
  //       params: param,
  //       responseType: 'text'
  //     });

  //      return this.http.request(req);
  // }


  // getFiles(): Observable<string[]> {
  //   return this.http.get('/getallfiles');
  // }

}
