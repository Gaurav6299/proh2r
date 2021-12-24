import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResignationTemplateComponent } from './resignation-template.component';

describe('ResignationTemplateComponent', () => {
  let component: ResignationTemplateComponent;
  let fixture: ComponentFixture<ResignationTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResignationTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResignationTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
