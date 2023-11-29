import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingViewComponent } from './landing-view.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatInputModule} from "@angular/material/input";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {MatSnackBarModule} from "@angular/material/snack-bar";

describe('LandingViewComponent', () => {
  let component: LandingViewComponent;
  let fixture: ComponentFixture<LandingViewComponent>;

  beforeEach(async () => {
    pending()
    await TestBed.configureTestingModule({
      declarations: [ LandingViewComponent ],
      imports: [
        MatDialogModule,
        MatInputModule,
        NoopAnimationsModule,
        MatSnackBarModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandingViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
