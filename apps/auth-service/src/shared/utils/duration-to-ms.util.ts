export const durationToMs = (duration: string): number => {
  const match = /^(\d+)([smhdw])$/.exec(duration);
  if (!match) throw new Error('Invalid duration format');
  const amount = parseInt(match[1], 10);
  const unit = match[2];
  const multipliers = {
    s: 1000,               
    m: 1000 * 60,          
    h: 1000 * 60 * 60,     
    d: 1000 * 60 * 60 * 24,
    w: 1000 * 60 * 60 * 24 * 7,
  };
  return amount * multipliers[unit];
}