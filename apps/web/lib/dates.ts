const dayInMilliseconds = 8.64e7;
const weekInMilliseconds = dayInMilliseconds * 7;

export const now = () => new Date().getTime();
export const dayFromNow = (daysFromNow?: number): number =>
  new Date(Date.now() + dayInMilliseconds * (daysFromNow ?? 1)).getTime();
export const weekFromNow = (weeksFromNow?: number): number =>
  new Date(Date.now() + weekInMilliseconds * (weeksFromNow ?? 1)).getTime();
