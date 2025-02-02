import ms from 'ms';

export const getResourceAge = (date: Date): string => {
  const creationTimestamp = new Date(date);
  const now = new Date();
  const ageMs = now.getTime() - creationTimestamp.getTime();

  return ms(ageMs, { long: false });
};
