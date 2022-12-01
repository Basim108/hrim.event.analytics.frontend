import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthPagesComponent } from './month-pages.component';

describe('MonthPagesComponent', () => {
  let component: MonthPagesComponent;
  let fixture: ComponentFixture<MonthPagesComponent>;

  beforeEach(async () => {
    pending()
    await TestBed.configureTestingModule({
      declarations: [ MonthPagesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
