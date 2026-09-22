export type PositionInputs = { capital: number; riskPercent: number; entry: number; stop: number; target: number; lot: number; fees: number; slippage: number };
export function positionSize(v: PositionInputs) {
  if (Object.values(v).some(n => !Number.isFinite(n)) || v.capital <= 0 || v.riskPercent <= 0 || v.riskPercent > 100 || v.entry <= 0 || v.stop <= 0 || v.stop >= v.entry || v.target <= v.entry || v.lot < 1 || !Number.isInteger(v.lot) || v.fees < 0 || v.slippage < 0) return null;
  const budget = v.capital * v.riskPercent / 100;
  const distance = v.entry - v.stop + v.slippage;
  const maxByRisk = Math.max(0, (budget - v.fees) / distance);
  const maxByCash = Math.max(0, (v.capital - v.fees) / (v.entry + v.slippage));
  const shares = Math.floor(Math.min(maxByRisk, maxByCash) / v.lot) * v.lot;
  const loss = shares ? shares * distance + v.fees : 0;
  const profit = shares ? shares * (v.target - v.entry - v.slippage) - v.fees : 0;
  return { budget, shares, lots: shares / v.lot, amount: shares * v.entry, loss, profit, ratio: loss > 0 ? profit / loss : null };
}
export function recoveryPercent(drawdown: number) { return drawdown >= 0 && drawdown < 100 ? drawdown / (100 - drawdown) * 100 : null; }
