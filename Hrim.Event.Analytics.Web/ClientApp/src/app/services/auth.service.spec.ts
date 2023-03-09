import {TestBed}                                        from '@angular/core/testing'
import {AuthService}                                    from './auth.service'
import {LogService}                                     from './log.service'
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing'
import {environment}                                    from '../../environments/environment'
import {skip, take}                                     from 'rxjs'
import {TestUsers}                                      from "../../test_data/users";

const USER_PROFILE_URL = `${environment.apiUrl}/v1/user-profile/me`

describe('AuthService', () => {
  let service: AuthService
  let httpTestingController: HttpTestingController
  let testUsers: TestUsers

  beforeEach(() => {
    testUsers = new TestUsers()
    TestBed.configureTestingModule({
                                     imports  : [HttpClientTestingModule],
                                     providers: [LogService]
                                   })
    service               = TestBed.inject(AuthService)
    httpTestingController = TestBed.inject(HttpTestingController)
  })
  afterEach(() => {
    httpTestingController.verify()
  })

  it('given 401 should emmit null user', done => {
    service.user$
           .pipe(
             skip(1),
             take(1)
           )
           .subscribe(user => {
             expect(user).toBeNull()
             done()
           })
    const req = httpTestingController.expectOne(USER_PROFILE_URL)
    expect(req.request.method).toEqual('GET')
    req.flush('Unauthorized', {status: 401, statusText: 'Unauthorized'})
  })

  it('given 401 should not log error', done => {
    let userNext     = jasmine.createSpy('userNext')
    const logService = TestBed.inject(LogService)
    spyOn(logService, 'error')
    service.user$
           .pipe(
             skip(1),
             take(1)
           )
           .subscribe(userNext)
    const req = httpTestingController.expectOne(USER_PROFILE_URL)
    expect(req.request.method).toEqual('GET')
    req.flush('Unauthorized', {status: 401, statusText: 'Unauthorized'})

    expect(logService.error).not.toHaveBeenCalled()
    done()
  })

  it('given 500 should not emmit null user', done => {
    let userNext = jasmine.createSpy('userNext')
    service.user$
           .pipe(
             skip(1),
             take(1)
           )
           .subscribe(userNext)
    const req = httpTestingController.expectOne(USER_PROFILE_URL)
    expect(req.request.method).toEqual('GET')
    req.flush('Internal Server Error', {status: 500, statusText: 'Internal Server Error'})

    expect(userNext).not.toHaveBeenCalled()
    done()
  })

  it('given 500 should log error', done => {
    let userNext     = jasmine.createSpy('userNext')
    const logService = TestBed.inject(LogService)
    spyOn(logService, 'error')
    service.user$
           .pipe(
             skip(1),
             take(1)
           )
           .subscribe(userNext)
    const req = httpTestingController.expectOne(USER_PROFILE_URL)
    expect(req.request.method).toEqual('GET')
    req.flush('Internal Server Error', {status: 500, statusText: 'Internal Server Error'})

    expect(logService.error).toHaveBeenCalled()
    done()
  })

  it('given a user should emmit it', done => {
    service.user$
           .pipe(
             skip(1),
             take(1)
           )
           .subscribe(user => {
             expect(user?.id).toEqual(testUsers.john_doe.id)
             done()
           })
    const req = httpTestingController.expectOne(USER_PROFILE_URL)
    expect(req.request.method).toEqual('GET')
    req.flush({...testUsers.john_doe})
  })
})
