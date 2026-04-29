export function formatPrice(value) {
  const n = parseFloat(value || 0);
  if (isNaN(n)) return "—";
  const [int, dec] = n.toFixed(2).split(".");
  return int.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "," + dec;
}
