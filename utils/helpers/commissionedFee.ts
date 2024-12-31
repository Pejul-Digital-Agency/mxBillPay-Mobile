export function applyCommission(
  percentage: string | undefined,
  amount: string | undefined
) {
  if (!percentage || !amount) {
    return '0.00';
  }
  // Correctly calculate commission as a percentage of the amount
  const commission = (parseFloat(amount) * parseFloat(percentage)) / 100;
  const commissionedAmount = commission;
  return commissionedAmount.toFixed(2);
}
