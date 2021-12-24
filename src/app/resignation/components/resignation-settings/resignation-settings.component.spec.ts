import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResignationSettingsComponent } from './resignation-settings.component';

describe('ResignationSettingsComponent', () => {
  let component: ResignationSettingsComponent;
  let fixture: ComponentFixture<ResignationSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResignationSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResignationSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
