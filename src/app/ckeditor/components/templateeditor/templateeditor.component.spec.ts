import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateeditorComponent } from './templateeditor.component';

describe('TemplateeditorComponent', () => {
  let component: TemplateeditorComponent;
  let fixture: ComponentFixture<TemplateeditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateeditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateeditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
