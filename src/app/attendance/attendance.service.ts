import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  pending = new BehaviorSubject<any>(null);
  approved = new BehaviorSubject<any>(null);
  cancelled = new BehaviorSubject<any>(null);
  rejected = new BehaviorSubject<any>(null);

  sendRegularizationRequestData(pending: any, approved: any, cancelled: any, rejected: any) {
    this.pending.next(pending);
    this.approved.next(approved);
    this.cancelled.next(cancelled);
    this.rejected.next(rejected);
  }
  sendOndutyRequestData(pending: any, approved: any, cancelled: any, rejected: any) {
    this.pending.next(pending);
    this.approved.next(approved);
    this.cancelled.next(cancelled);
    this.rejected.next(rejected);
  }
  clearData() {
    this.pending.next([]);
    this.approved.next([]);
    this.cancelled.next([]);
    this.rejected.next([]);
  }
  getRegularizationPendingRequest(): Observable<any> {
    return this.pending.asObservable();
  }
  getRegularizationApprovedRequest(): Observable<any> {
    return this.approved.asObservable();
  }
  getRegularizationCancelledRequest(): Observable<any> {
    return this.cancelled.asObservable();
  }
  getRegularizationRejectedRequest(): Observable<any> {
    return this.rejected.asObservable();
  }
  getOndutyPendingRequest(): Observable<any> {
    return this.pending.asObservable();
  }
  getOndutyApprovedRequest(): Observable<any> {
    return this.approved.asObservable();
  }
  getOndutyCancelledRequest(): Observable<any> {
    return this.cancelled.asObservable();
  }
  getOndutyRejectedRequest(): Observable<any> {
    return this.rejected.asObservable();
  }
  constructor() { }

}
