const dayInMilliseconds = 8.64e+7;
const weekInMilliseconds = dayInMilliseconds * 7;

export const now = () => new Date();
export const dayFromNow = (daysFromNow?: number ): Date => new Date(Date.now() + dayInMilliseconds * (daysFromNow ?? 1));
export const weekFromNow = (weeksFromNow?: number): Date => new Date(Date.now() + weekInMilliseconds * (weeksFromNow ?? 1)); 
