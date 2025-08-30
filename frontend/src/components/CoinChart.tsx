import { Line } from "react-chartjs-2";

export default function CoinChart({ prices }: { prices: number[] }) {
  return (
    <Line
      data={{
        labels: prices.map((_, i) => i),
        datasets: [
          {
            label: "Price",
            data: prices,
            borderColor: "blue",
            backgroundColor: "rgba(0, 0, 255, 0.1)",
          },
        ],
      }}
    />
  );
}
