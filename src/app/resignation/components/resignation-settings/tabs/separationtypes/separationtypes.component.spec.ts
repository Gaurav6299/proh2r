import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeparationtypesComponent } from './separationtypes.component';

describe('SeparationtypesComponent', () => {
  let component: SeparationtypesComponent;
  let fixture: ComponentFixture<SeparationtypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeparationtypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeparationtypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
