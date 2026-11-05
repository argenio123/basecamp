/**
 * A price string with the currency moved after the figure as a small mark (.mb-cur), so display-size prices read
 * "4,500 Php" and sit right before the unit ("/month"): "Php 3,200" → "3,200 Php", "Php 1,200–2,500" →
 * "1,200–2,500 Php", "From Php 300" → "From 300 Php". Strings without "Php" are shown as they are.
 */
export default function Money({ value }: { value: string }) {
  if (!/Php/.test(value)) return <>{value}</>;
  const figure = value.replace(/Php\s?/g, "").trim();
  return (
    <>
      {figure}
      <span className="mb-cur">Php</span>
    </>
  );
}
