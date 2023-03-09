import {MonthViewRouteModel} from "./month-view-route.model";
import {YearViewRouteModel}  from "./year-view-route.model";
import {DateTime}            from "luxon";
import {UrlSegment}          from "@angular/router";

describe('DateViewRouteModel', () => {

  it('MonthViewRouteModel path should be month', () => {
    expect(new MonthViewRouteModel().path).toEqual('month')
  })

  it('MonthViewRouteModel format should be yyyy-MM', () => {
    expect(new MonthViewRouteModel().format).toEqual('yyyy-MM')
  })

  it('MonthViewRouteModel configPath should be correct', () => {
    expect(new MonthViewRouteModel().configPath).toEqual('month/:date')
  })

  it('MonthViewRouteModel getRouteString should be correct', () => {
    const expectedDate = DateTime.now().toFormat('yyyy-MM')
    expect(new MonthViewRouteModel().getRouteString(DateTime.now())).toEqual(`month/${expectedDate}`)
  })

  it('MonthViewRouteModel getDateFromParams given correct params should return date', () => {
    const expectedDate = DateTime.now().toFormat('yyyy-MM')
    const params       = {'date': expectedDate}
    expect(new MonthViewRouteModel().getDateFromParams(params)?.toFormat('yyyy-MM')).toEqual(expectedDate)
  })

  it('MonthViewRouteModel getDateFromParams given incorrect params should return null', () => {
    const params = {'date': 'hello world'}
    expect(new MonthViewRouteModel().getDateFromParams(params)).toBeNull()
  })

  it('MonthViewRouteModel getDateFromUrl given correct params should return date', () => {
    const expectedDate      = DateTime.now().toFormat('yyyy-MM')
    const url: UrlSegment[] = [
      new UrlSegment('month', {'date': ''}),
      new UrlSegment(expectedDate, {'date': expectedDate})
    ]
    expect(new MonthViewRouteModel().getDateFromUrl(url)?.toFormat('yyyy-MM')).toEqual(expectedDate)
  })

  it('MonthViewRouteModel getDateFromUrl given incorrect params should return null', () => {
    const url: UrlSegment[] = [
      new UrlSegment('month', {'date': ''}),
      new UrlSegment('month', {'date': 'hello world'})
    ]
    expect(new MonthViewRouteModel().getDateFromUrl(url)).toBeNull()
  })

  it('YearViewRouteModel path should be year', () => {
    expect(new YearViewRouteModel().path).toEqual('year')
  })

  it('YearViewRouteModel format should be yyyy', () => {
    expect(new YearViewRouteModel().format).toEqual('yyyy')
  })

  it('YearViewRouteModel configPath should be correct', () => {
    expect(new YearViewRouteModel().configPath).toEqual('year/:date')
  })

  it('YearViewRouteModel getRouteString should be correct', () => {
    const expectedDate = DateTime.now().toFormat('yyyy')
    expect(new YearViewRouteModel().getRouteString(DateTime.now())).toEqual(`year/${expectedDate}`)
  })

  it('YearViewRouteModel getDateFromParams given correct params should return date', () => {
    const expectedDate = DateTime.now().toFormat('yyyy')
    const params       = {'date': expectedDate}
    expect(new YearViewRouteModel().getDateFromParams(params)?.toFormat('yyyy')).toEqual(expectedDate)
  })

  it('YearViewRouteModel getDateFromParams given incorrect params should return null', () => {
    const params = {'date': 'hello world'}
    expect(new YearViewRouteModel().getDateFromParams(params)).toBeNull()
  })

  it('YearViewRouteModel getDateFromUrl given correct params should return date', () => {
    const expectedDate      = DateTime.now().toFormat('yyyy')
    const url: UrlSegment[] = [
      new UrlSegment('year', {'date': ''}),
      new UrlSegment(expectedDate, {'date': expectedDate})
    ]
    expect(new YearViewRouteModel().getDateFromUrl(url)?.toFormat('yyyy')).toEqual(expectedDate)
  })

  it('YearViewRouteModel getDateFromUrl given incorrect params should return null', () => {
    const url: UrlSegment[] = [
      new UrlSegment('year', {'date': ''}),
      new UrlSegment('year', {'date': 'hello world'})
    ]
    expect(new YearViewRouteModel().getDateFromUrl(url)).toBeNull()
  })
})
