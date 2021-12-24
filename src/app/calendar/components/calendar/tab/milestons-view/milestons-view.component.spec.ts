import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MilestonsViewComponent } from './milestons-view.component';

describe('MilestonsViewComponent', () => {
  let component: MilestonsViewComponent;
  let fixture: ComponentFixture<MilestonsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MilestonsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MilestonsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
