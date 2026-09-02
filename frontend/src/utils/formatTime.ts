export const formatTime = (time24: string): string => {
  const [hoursStr, minutes] = time24.split(':');
  const hours = parseInt(hoursStr, 10);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  return `${hours12}:${minutes} ${period}`;
};
