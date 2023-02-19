import {ComponentFixture, TestBed} from '@angular/core/testing'

import {AuthMenuComponent} from './auth-menu.component'
import {AuthService} from '../services/auth.service'
import {LogService} from '../services/log.service'
import {HttpClientTestingModule} from '@angular/common/http/testing'

describe('AuthMenuComponent', () => {
  let component: AuthMenuComponent
  let fixture: ComponentFixture<AuthMenuComponent>
  let authService: AuthService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
                   imports: [HttpClientTestingModule],
                   declarations: [AuthMenuComponent],
                   providers:    [AuthService, LogService]
                 })
                 .compileComponents()

    authService = TestBed.inject(AuthService)
    spyOn(authService, 'login')
    spyOn(authService, 'logout')
    fixture   = TestBed.createComponent(AuthMenuComponent)
    component = fixture.componentInstance
    component.isAuthenticated = false
    fixture.detectChanges()
  })

  it('clicked on google login should login in google', () => {
    let button = fixture.debugElement.nativeElement.querySelector('a.login-google-btn');
    expect(button).toBeDefined()
    button.click();
    expect(authService.login).toHaveBeenCalledWith('google')
  })


  it('clicked on facebook login should login in facebook', () => {
    let button = fixture.debugElement.nativeElement.querySelector('a.login-facebook-btn');
    expect(button).toBeDefined()
    button.click();
    expect(authService.login).toHaveBeenCalledWith('facebook')
  })

  it('clicked on logout should logout', () => {
    component.isAuthenticated = true
    fixture.detectChanges()
    let button = fixture.debugElement.nativeElement.querySelector('a.logout-btn');
    expect(button).toBeDefined()
    button.click();
    expect(authService.logout).toHaveBeenCalledWith()
  })
})
