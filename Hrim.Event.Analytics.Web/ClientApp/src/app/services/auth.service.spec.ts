import {TestBed} from '@angular/core/testing'
import {AuthService} from './auth.service'
import {LogService} from './log.service'
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing'
import {skip, take} from 'rxjs'
import {TestUsers} from "../../test_data/users";
import mockLocalStorage from "../../test_data/mock-localstorage";
import {Router} from "@angular/router";


const USER_PROFILE_URL = '/account/profile/me'
const ACCESS_TOKEN_URL = '/account/token'

class MockRouter {
  navigateByUrl(url: string) {
    return Promise.resolve(url)
  }
}

describe('AuthService', () => {
  let service: AuthService
  let httpTestingController: HttpTestingController
  let testUsers: TestUsers
  let userNext: jasmine.Spy<jasmine.Func>

  beforeEach(() => {
    mockLocalStorage()
    testUsers = new TestUsers()
    userNext = jasmine.createSpy('userNext')
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        LogService,
        {provide: Router, useClass: MockRouter}
      ]
    })
    service = TestBed.inject(AuthService)
    httpTestingController = TestBed.inject(HttpTestingController)
    const reqAccessToken = httpTestingController.expectOne(ACCESS_TOKEN_URL)
    reqAccessToken.flush('jwt', {status: 200, statusText: 'Ok'})
    const reqCrudApi = httpTestingController.expectOne('/backend/crud')
    reqCrudApi.flush('"https://crud.api"', {status: 200, statusText: 'Ok'})
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
    const reqUserProfile = httpTestingController.expectOne(USER_PROFILE_URL)
    expect(reqUserProfile.request.method).toEqual('GET')
    reqUserProfile.flush('Unauthorized', {status: 401, statusText: 'Unauthorized'})
  })

  it('given 401 should not log error', done => {
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

  it('given a user when unauthorized-url-request is set should navigate to it', done => {
    localStorage.setItem('unauthorized-url-request', '/month/2023-06')

    const req = httpTestingController.expectOne(USER_PROFILE_URL)
    expect(req.request.method).toEqual('GET')
    req.flush({...testUsers.john_doe})

    service.user$.subscribe(user => {
      expect(localStorage.removeItem).toHaveBeenCalledOnceWith('unauthorized-url-request')
      done()
    })
  })
})
