export function formatNumberToK(num: number) {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
}

export function deepCopy(obj: Object) {
  return JSON.parse(JSON.stringify(obj));
}
