export const timeStrToDuration = (timeStr) => {
  const timeUnits = {
    d: 24 * 60 * 60 * 1000,
    h: 60 * 60 * 1000,
    m: 60 * 1000,
    s: 1000,
  };

  const value = parseInt(timeStr.slice(0, -1), 10);
  const unit = timeStr.slice(-1);

  return value * (timeUnits[unit] || 0);
};
