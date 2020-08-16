import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VtxComponent } from './vtx.component';

describe('VtxComponent', () => {
  let component: VtxComponent;
  let fixture: ComponentFixture<VtxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VtxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VtxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
