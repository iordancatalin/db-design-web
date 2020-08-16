import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageOptionsComponent } from './storage-options.component';

describe('StorageOptionsComponent', () => {
  let component: StorageOptionsComponent;
  let fixture: ComponentFixture<StorageOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StorageOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StorageOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
