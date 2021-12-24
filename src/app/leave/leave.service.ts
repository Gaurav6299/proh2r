import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable()
export class LeaveService {
  pending = new BehaviorSubject<any>(null);
  approved = new BehaviorSubject<any>(null);
  rejected = new BehaviorSubject<any>(null);
  cancelled = new BehaviorSubject<any>(null);
  sendApplicationData(pending: any, approved: any, cancelled: any, rejected: any) {
    this.pending.next(pending);
    this.approved.next(approved);
    this.cancelled.next(cancelled);
    this.rejected.next(rejected);
  }
  sendCompOffsData(pending: any, approved: any, rejected: any) {
    this.pending.next(pending);
    this.approved.next(approved);
    this.rejected.next(rejected);
  }
  clearData() {
    this.pending.next([]);
    this.approved.next([]);
    this.cancelled.next([]);
    this.rejected.next([]);
  }
  getApplicationPendingRequest(): Observable<any> {
    return this.pending.asObservable();
  }
  getApplicationApprovedRequest(): Observable<any> {
    return this.approved.asObservable();
  }
  getApplicationCancelledRequest(): Observable<any> {
    return this.cancelled.asObservable();
  }
  getApplicationRejectedRequest(): Observable<any> {
    return this.rejected.asObservable();
  }
  getCompOffsPendingRequest(): Observable<any> {
    return this.pending.asObservable();
  }
  getCompOffsApprovedRequest(): Observable<any> {
    return this.approved.asObservable();
  }
  getCompOffsRejectedRequest(): Observable<any> {
    return this.rejected.asObservable();
  }
  constructor() { }

}
