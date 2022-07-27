import {CalendarService} from './calendar.service';
import {TestBed} from "@angular/core/testing";
import {DateTime} from "luxon";

describe('CalendarService', () => {
  let service: CalendarService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [CalendarService] });
    service = TestBed.inject(CalendarService);
  });

  it('given July 2022 should generate weeks starting from 26 June 2022', () => {
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

  it('given July 2022 should generate weeks ending with 6 August 2022', () => {
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

  it('given June 2022 should generate weeks starting from 29 May 2022', () => {
    const month = DateTime.fromISO('2022-06-23');
    const actualWeeks = service.getWeeks(month);
    expect(actualWeeks).not.toBeNull();
    expect(actualWeeks.length).toBeGreaterThan(0);
    const firstWeek = actualWeeks[0];
    expect(firstWeek).not.toBeNull();
    expect(firstWeek.days).not.toBeNull();
    expect(firstWeek.days.length).toBe(7);

    expect(firstWeek.days[0]).not.toBeNull();
    expect(firstWeek.days[0].day).toBe(29);
    expect(firstWeek.days[1]).not.toBeNull();
    expect(firstWeek.days[1].day).toBe(30);
    expect(firstWeek.days[2]).not.toBeNull();
    expect(firstWeek.days[2].day).toBe(31);
    expect(firstWeek.days[3]).not.toBeNull();
    expect(firstWeek.days[3].day).toBe(1);
    expect(firstWeek.days[4]).not.toBeNull();
    expect(firstWeek.days[4].day).toBe(2);
    expect(firstWeek.days[5]).not.toBeNull();
    expect(firstWeek.days[5].day).toBe(3);
    expect(firstWeek.days[6]).not.toBeNull();
    expect(firstWeek.days[6].day).toBe(4);
  });

  it('given June 2022 should generate weeks ending with 6 August 2022', () => {
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

  it('given June 2022 should set weekOfYear of first week to 22', () => {
    const month = DateTime.fromISO('2022-06-23');
    const actualWeeks = service.getWeeks(month);
    expect(actualWeeks).not.toBeNull();
    expect(actualWeeks.length).toBeGreaterThan(0);
    const firstWeek = actualWeeks[0];
    expect(firstWeek.weekOfYear).toBe(22);
  });

});
