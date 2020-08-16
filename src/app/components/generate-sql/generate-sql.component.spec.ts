import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateSqlComponent } from './generate-sql.component';

describe('GenerateSqlComponent', () => {
  let component: GenerateSqlComponent;
  let fixture: ComponentFixture<GenerateSqlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateSqlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateSqlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
