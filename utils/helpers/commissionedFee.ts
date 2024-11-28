export function applyCommission(
  percentage: string | undefined,
  amount: string | undefined
) {
  if (!percentage || !amount) {
    return '0.00';
  }
  const commission = parseFloat(amount) * parseFloat(percentage);
  const commissionedAmount = parseFloat(amount) + commission;
  return commissionedAmount.toFixed(2).toString();
}
