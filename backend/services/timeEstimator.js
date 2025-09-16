// services/timeEstimator.js

function isHoliday(date, recurringHolidays = [], oneTimeHolidays = []) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const weekday = date.getDay();
  const dateStr = date.toISOString().split("T")[0];

  if (weekday === 0 || weekday === 6) return true; // Weekend
  if (recurringHolidays.some(h => h.day === day && h.month === month)) return true;
  if (oneTimeHolidays.some(h => h.date === dateStr)) return true;

  return false;
}

function calculateEndDate(startDate, estimateDays, workHours = { startHour: 8, endHour: 16 }, recurringHolidays = [], oneTimeHolidays = []) {
  const workMsPerDay = (workHours.endHour - workHours.startHour) * 3600 * 1000;
  let remainingMs = estimateDays * workMsPerDay;
  let current = new Date(startDate);

  // Adjust start to next working hour if needed
  if (current.getHours() < workHours.startHour) current.setHours(workHours.startHour, 0, 0, 0);
  if (current.getHours() >= workHours.endHour || isHoliday(current, recurringHolidays, oneTimeHolidays)) {
    do {
      current.setDate(current.getDate() + 1);
    } while (isHoliday(current, recurringHolidays, oneTimeHolidays));
    current.setHours(workHours.startHour, 0, 0, 0);
  }

  while (remainingMs > 0) {
    if (isHoliday(current, recurringHolidays, oneTimeHolidays)) {
      current.setDate(current.getDate() + 1);
      current.setHours(workHours.startHour, 0, 0, 0);
      continue;
    }

    const dayEnd = new Date(current);
    dayEnd.setHours(workHours.endHour, 0, 0, 0);

    const availableMs = dayEnd - current;
    const consume = Math.min(availableMs, remainingMs);
    current = new Date(current.getTime() + consume);
    remainingMs -= consume;

    if (remainingMs > 0) {
      do {
        current.setDate(current.getDate() + 1);
      } while (isHoliday(current, recurringHolidays, oneTimeHolidays));
      current.setHours(workHours.startHour, 0, 0, 0);
    }
  }

  return current;
}

module.exports = { calculateEndDate };
