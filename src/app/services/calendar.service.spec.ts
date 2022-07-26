import { CalendarService } from './calendar.service';

describe('CalendarService', () => {

  it('given July 2022 should generate weeks starting from 26 June 2022', () => {
    const actualWeeks = new CalendarService().getWeeks();
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
  });
});
