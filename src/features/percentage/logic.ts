export function percentOf(percent: number, whole: number): number {
  return (percent / 100) * whole;
}

export function ratioPercent(part: number, whole: number): number | null {
  if (whole === 0) {
    return null;
  }
  return (part / whole) * 100;
}

export function changePercent(from: number, to: number): number | null {
  if (from === 0) {
    return null;
  }
  return ((to - from) / from) * 100;
}
