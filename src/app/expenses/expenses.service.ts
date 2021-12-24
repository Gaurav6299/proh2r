import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable()
export class ExpensesService {
  pending = new BehaviorSubject<any>(null);
  approved = new BehaviorSubject<any>(null);
  rejected = new BehaviorSubject<any>(null);
  cancelled = new BehaviorSubject<any>(null);
  pendingAdvance = new BehaviorSubject<any>(null);
  approvedAdvance = new BehaviorSubject<any>(null);
  rejectedAdvance = new BehaviorSubject<any>(null);
  cancelledAdvance = new BehaviorSubject<any>(null);
  approvalStatus = new BehaviorSubject<any>(null);

  sendExpenseData(pending: any, approved: any, cancelled: any, rejected: any) {
    this.pending.next(pending);
    this.approved.next(approved);
    this.cancelled.next(cancelled);
    this.rejected.next(rejected);
  }
  sendTeamAdvanceData(pending: any, approved: any, rejected: any, cancelled: any) {
    this.pendingAdvance.next(pending);
    this.approvedAdvance.next(approved);
    this.rejectedAdvance.next(rejected);
    this.cancelledAdvance.next(cancelled);
  }
  clearData() {
    this.pending.next([]);
    this.approved.next([]);
    this.cancelled.next([]);
    this.rejected.next([]);
  }
  clearAdvanceData() {
    this.pendingAdvance.next([]);
    this.approvedAdvance.next([]);
    this.rejectedAdvance.next([]);
    this.cancelledAdvance.next([]);
  }
  getExpensePendingRequest(): Observable<any> {
    return this.pending.asObservable();
  }
  getExpenseApprovedRequest(): Observable<any> {
    return this.approved.asObservable();
  }
  getExpenseCancelledRequest(): Observable<any> {
    return this.cancelled.asObservable();
  }
  getExpenseRejectedRequest(): Observable<any> {
    return this.rejected.asObservable();
  }
  getTeamAdvancePendingRequest(): Observable<any> {
    return this.pendingAdvance.asObservable();
  }
  getTeamAdvanceApprovedRequest(): Observable<any> {
    return this.approvedAdvance.asObservable();
  }
  getTeamAdvanceRejectedRequest(): Observable<any> {
    return this.rejectedAdvance.asObservable();
  }
  getTeamAdvanceCancelledRequest(): Observable<any> {
    return this.cancelledAdvance.asObservable();
  }

  changedStatus(value: any) {
    this.approvalStatus.next(value);
  }
  getApprovalStatus() {
    return this.approvalStatus.asObservable();
  }
  constructor() { }

}
