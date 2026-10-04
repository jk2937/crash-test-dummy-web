// A number the way the game prints one (HudGrid.short): as it is below a
// thousand, then three figures and K, M, B or T -- 147, 1.78K, 2.50M, 10.0M.
export function shortNumber(n: number): string {
  const units = ['', 'K', 'M', 'B', 'T'];
  let i = 0;
  let v = Math.floor(n);
  while (Math.abs(v) >= 1000 && i < units.length - 1) {
    v /= 1000;
    i++;
  }
  if (i === 0) return String(v);
  const digits = Math.abs(v) >= 100 ? 0 : Math.abs(v) >= 10 ? 1 : 2;
  return `${v.toFixed(digits)}${units[i]}`;
}
