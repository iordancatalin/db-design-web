import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveIndicatorComponent } from './save-indicator.component';

describe('SaveIndicatorComponent', () => {
  let component: SaveIndicatorComponent;
  let fixture: ComponentFixture<SaveIndicatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaveIndicatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
