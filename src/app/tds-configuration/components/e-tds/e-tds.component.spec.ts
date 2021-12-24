import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ETDSComponent } from './e-tds.component';

describe('ETDSComponent', () => {
  let component: ETDSComponent;
  let fixture: ComponentFixture<ETDSComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ETDSComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ETDSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
