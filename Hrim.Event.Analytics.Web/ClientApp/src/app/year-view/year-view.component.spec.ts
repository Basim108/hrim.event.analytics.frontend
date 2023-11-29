import {ComponentFixture, TestBed} from '@angular/core/testing';

import {YearViewComponent} from './year-view.component';
import {NoopAnimationsModule} from "@angular/platform-browser/animations";

describe('YearViewComponent', () => {
  let component: YearViewComponent;
  let fixture: ComponentFixture<YearViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [YearViewComponent],
      imports: [NoopAnimationsModule]
    })
      .compileComponents();

    fixture = TestBed.createComponent(YearViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
