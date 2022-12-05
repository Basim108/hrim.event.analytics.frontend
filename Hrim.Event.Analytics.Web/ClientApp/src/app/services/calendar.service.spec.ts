import {CalendarService} from './calendar.service';
import {TestBed} from "@angular/core/testing";
import {DateTime} from "luxon";

describe('CalendarService', () => {
  let service: CalendarService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [CalendarService] });
    service = TestBed.inject(CalendarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getWeeks should generate weeks when first day of month is not first day of week', () => {
    const month = DateTime.fromISO('2022-07-23');
    const actualWeeks = service.getWeeks(month);
    expect(actualWeeks).not.toBeNull();
    expect(actualWeeks.length).toBeGreaterThan(0);
    const firstWeek = actualWeeks[0];
    expect(firstWeek).not.toBeNull();
    expect(firstWeek.days).not.toBeNull();
    expect(firstWeek.days.length).toBe(7);

    expect(firstWeek.days[0]).not.toBeNull();
    expect(firstWeek.days[0].day).toBe(26);
    expect(firstWeek.days[1]).not.toBeNull();
    expect(firstWeek.days[1].day).toBe(27);
    expect(firstWeek.days[2]).not.toBeNull();
    expect(firstWeek.days[2].day).toBe(28);
    expect(firstWeek.days[3]).not.toBeNull();
    expect(firstWeek.days[3].day).toBe(29);
    expect(firstWeek.days[4]).not.toBeNull();
    expect(firstWeek.days[4].day).toBe(30);
    expect(firstWeek.days[5]).not.toBeNull();
    expect(firstWeek.days[5].day).toBe(1);
    expect(firstWeek.days[6]).not.toBeNull();
    expect(firstWeek.days[6].day).toBe(2);
  });

  it('getWeeks should generate weeks when last day is the last week day (sunday)', () => {
    const month = DateTime.fromISO('2022-07-23');
    const actualWeeks = service.getWeeks(month);
    expect(actualWeeks).not.toBeNull();
    expect(actualWeeks.length).toBeGreaterThan(0);
    const lastWeek = actualWeeks[actualWeeks.length-1];
    expect(lastWeek).not.toBeNull();
    expect(lastWeek.days).not.toBeNull();
    expect(lastWeek.days.length).toBe(7);

    expect(lastWeek.days[0]).not.toBeNull();
    expect(lastWeek.days[0].day).toBe(31);
    expect(lastWeek.days[1]).not.toBeNull();
    expect(lastWeek.days[1].day).toBe(1);
    expect(lastWeek.days[2]).not.toBeNull();
    expect(lastWeek.days[2].day).toBe(2);
    expect(lastWeek.days[3]).not.toBeNull();
    expect(lastWeek.days[3].day).toBe(3);
    expect(lastWeek.days[4]).not.toBeNull();
    expect(lastWeek.days[4].day).toBe(4);
    expect(lastWeek.days[5]).not.toBeNull();
    expect(lastWeek.days[5].day).toBe(5);
    expect(lastWeek.days[6]).not.toBeNull();
    expect(lastWeek.days[6].day).toBe(6);
  });

  it('getWeeks should generate weeks when last day is in the middle of a week', () => {
    const month = DateTime.fromISO('2022-06-23');
    const actualWeeks = service.getWeeks(month);
    expect(actualWeeks).not.toBeNull();
    expect(actualWeeks.length).toBeGreaterThan(0);
    const lastWeek = actualWeeks[actualWeeks.length-1];
    expect(lastWeek).not.toBeNull();
    expect(lastWeek.days).not.toBeNull();
    expect(lastWeek.days.length).toBe(7);

    expect(lastWeek.days[0]).not.toBeNull();
    expect(lastWeek.days[0].day).toBe(26);
    expect(lastWeek.days[1]).not.toBeNull();
    expect(lastWeek.days[1].day).toBe(27);
    expect(lastWeek.days[2]).not.toBeNull();
    expect(lastWeek.days[2].day).toBe(28);
    expect(lastWeek.days[3]).not.toBeNull();
    expect(lastWeek.days[3].day).toBe(29);
    expect(lastWeek.days[4]).not.toBeNull();
    expect(lastWeek.days[4].day).toBe(30);
    expect(lastWeek.days[5]).not.toBeNull();
    expect(lastWeek.days[5].day).toBe(1);
    expect(lastWeek.days[6]).not.toBeNull();
    expect(lastWeek.days[6].day).toBe(2);
  });

  it('getWeeks should set weekOfYear', () => {
    const month = DateTime.fromISO('2022-06-23');
    const actualWeeks = service.getWeeks(month);
    expect(actualWeeks).not.toBeNull();
    expect(actualWeeks.length).toBeGreaterThan(0);
    const firstWeek = actualWeeks[0];
    expect(firstWeek.weekOfYear).toBe(22);
  });

});
