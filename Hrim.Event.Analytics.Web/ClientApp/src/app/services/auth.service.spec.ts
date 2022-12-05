import {TestBed} from "@angular/core/testing";
import {AuthService} from "./auth.service";
import {LogService} from "./log.service";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {environment} from "../../environments/environment";
import {USERS} from "../../test_data/users";
import {skip, take} from "rxjs";

const USER_PROFILE_URL = `${environment.apiUrl}/v1/user-profile/me`

describe('AuthService', () => {
  let service: AuthService
  let httpTestingController: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LogService]
    })
    service = TestBed.inject(AuthService)
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
    req.flush('Unathurized', {status: 401, statusText: 'Unathurized'})
  })

  it('given a user should emmit it', done => {
    service.user$
           .pipe(
             skip(1),
             take(1)
           )
           .subscribe(user => {
             expect(user?.id).toEqual(USERS["john_doe"].id)
             done()
           })
    const req = httpTestingController.expectOne(USER_PROFILE_URL)
    expect(req.request.method).toEqual('GET')
    req.flush({...USERS["john_doe"]})
  })
})
