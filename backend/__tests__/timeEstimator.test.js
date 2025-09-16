const { calculateEndDate } = require("../services/timeEstimator");

describe("Time Estimation Tests (Assignment Requirements)", () => {
  // Working hours in UTC
  const workHours = { startHour: 8, endHour: 16 };
  const recurringHolidays = [];
  const oneTimeHolidays = [];

  test("24-05-2004 18:05, -5.5 days", () => {
    const startDate = new Date("2004-05-24T18:05:00Z");
    const estimateDays = -5.5;
    const endDate = calculateEndDate(
      startDate,
      estimateDays,
      workHours,
      recurringHolidays,
      oneTimeHolidays
    );
    expect(endDate.toISOString()).toBe("2004-05-14T12:00:00.000Z");
  });

  test("24-05-2004 19:03, 44.723656 days", () => {
    const startDate = new Date("2004-05-24T19:03:00Z");
    const estimateDays = 44.723656;
    const endDate = calculateEndDate(
      startDate,
      estimateDays,
      workHours,
      recurringHolidays,
      oneTimeHolidays
    );
    expect(endDate.toISOString()).toBe("2004-07-27T13:47:00.000Z");
  });

  test("24-05-2004 18:03, -6.7470217 days", () => {
    const startDate = new Date("2004-05-24T18:03:00Z");
    const estimateDays = -6.7470217;
    const endDate = calculateEndDate(
      startDate,
      estimateDays,
      workHours,
      recurringHolidays,
      oneTimeHolidays
    );
    expect(endDate.toISOString()).toBe("2004-05-13T10:02:00.000Z");
  });

  test("24-05-2004 08:03, 12.782709 days", () => {
    const startDate = new Date("2004-05-24T08:03:00Z");
    const estimateDays = 12.782709;
    const endDate = calculateEndDate(
      startDate,
      estimateDays,
      workHours,
      recurringHolidays,
      oneTimeHolidays
    );
    expect(endDate.toISOString()).toBe("2004-06-10T14:18:00.000Z");
  });

  test("24-05-2004 07:03, 8.276628 days", () => {
    const startDate = new Date("2004-05-24T07:03:00Z");
    const estimateDays = 8.276628;
    const endDate = calculateEndDate(
      startDate,
      estimateDays,
      workHours,
      recurringHolidays,
      oneTimeHolidays
    );
    expect(endDate.toISOString()).toBe("2004-06-04T10:12:00.000Z");
  });
});
