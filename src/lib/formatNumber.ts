export const formatNumber = (value: number): string => {
  const absValue = Math.abs(value);
  
  if (absValue >= 1e9) {
    return (value / 1e9).toFixed(2) + 'B';
  }
  if (absValue >= 1e6) {
    return (value / 1e6).toFixed(2) + 'M';
  }
  if (absValue >= 1e3) {
    return (value / 1e3).toFixed(2) + 'K';
  }
  
  return value.toFixed(2);
};