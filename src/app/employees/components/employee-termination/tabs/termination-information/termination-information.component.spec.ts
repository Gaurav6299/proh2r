import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminationInformationComponent } from './termination-information.component';

describe('TerminationInformationComponent', () => {
  let component: TerminationInformationComponent;
  let fixture: ComponentFixture<TerminationInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerminationInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminationInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
