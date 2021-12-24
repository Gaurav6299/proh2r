import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruitmentConfigurationComponent } from './recruitment-configuration.component';

describe('RecruitmentConfigurationComponent', () => {
  let component: RecruitmentConfigurationComponent;
  let fixture: ComponentFixture<RecruitmentConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecruitmentConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecruitmentConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
