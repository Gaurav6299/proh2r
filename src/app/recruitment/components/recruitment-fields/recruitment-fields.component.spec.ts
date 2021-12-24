import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruitmentFieldsComponent } from './recruitment-fields.component';

describe('RecruitmentFieldsComponent', () => {
  let component: RecruitmentFieldsComponent;
  let fixture: ComponentFixture<RecruitmentFieldsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecruitmentFieldsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecruitmentFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
