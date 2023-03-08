import {ComponentFixture, TestBed} from '@angular/core/testing'

import {AuthMenuComponent}       from './auth-menu.component'
import {AuthService}             from '../services/auth.service'
import {LogService}              from '../services/log.service'
import {HttpClientTestingModule} from '@angular/common/http/testing'
import {TestUsers}               from '../../test_data/users'

describe('AuthMenuComponent', () => {
  let component: AuthMenuComponent
  let fixture: ComponentFixture<AuthMenuComponent>
  let authService: AuthService
  let testUsers: TestUsers

  beforeEach(async () => {
    testUsers = new TestUsers()
    await TestBed.configureTestingModule({
                                           imports     : [HttpClientTestingModule],
                                           declarations: [AuthMenuComponent],
                                           providers   : [AuthService, LogService]
                                         })
                 .compileComponents()

    authService = TestBed.inject(AuthService)
    spyOn(authService, 'login')
    spyOn(authService, 'logout')
    fixture   = TestBed.createComponent(AuthMenuComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('clicked on google login should login in google', () => {
    let button = fixture.debugElement.nativeElement.querySelector('a.login-google-btn');
    expect(button).not.toBeNull()
    button.click();
    expect(authService.login).toHaveBeenCalledWith('google')
  })


  it('clicked on facebook login should login in facebook', () => {
    let button = fixture.debugElement.nativeElement.querySelector('a.login-facebook-btn');
    expect(button).not.toBeNull()
    button.click();
    expect(authService.login).toHaveBeenCalledWith('facebook')
  })

  it('clicked on logout should logout', () => {
    authService.user$.next(testUsers.john_doe)
    fixture.detectChanges()
    let button = fixture.debugElement.nativeElement.querySelector('a.logout-btn');
    expect(button).not.toBeNull()
    button.click();
    expect(authService.logout).toHaveBeenCalledWith()
  })
})
