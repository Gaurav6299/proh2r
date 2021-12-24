import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetDeallocationComponent } from './asset-deallocation.component';

describe('AssetDeallocationComponent', () => {
  let component: AssetDeallocationComponent;
  let fixture: ComponentFixture<AssetDeallocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetDeallocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetDeallocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
