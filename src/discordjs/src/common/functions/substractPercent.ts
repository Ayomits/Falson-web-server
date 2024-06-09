export function subtractPercent(number: number, percent: number): number {
  const percentage = percent >= 0 ? percent : percent * -1;
  return number + Math.floor(number - (number * percentage) / 100);
}
