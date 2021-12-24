import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class OrganizationService {
  private companyName = new BehaviorSubject<any>(null);
  private loadData = new BehaviorSubject<any>(null);
  private uploadedFile = new BehaviorSubject<any>(null);
  private parentOrgProfileId = new BehaviorSubject<any>(null);
  sendCompanyName(companyName: any): void {
    this.companyName.next(companyName);
  }
  getCompanyName(): Observable<any> {
    return this.companyName.asObservable();
  }
  uploadedFileStatus(): void {
    this.uploadedFile.next(true);
    console.log("Hellooo I am Upload Fle Status Start")
  }
  getUploadedFileStatus(): Observable<any> {
    return this.uploadedFile.asObservable();
  }
  sendParentOrgProfileId(parentOrgProfileId: any): void {
    this.parentOrgProfileId.next(parentOrgProfileId);
  }
  getParentOrgProfileId(): Observable<any> {
    return this.parentOrgProfileId.asObservable();
  }
  constructor() { }
}
