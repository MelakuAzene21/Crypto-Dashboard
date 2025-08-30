// frontend/src/components/CoinChart.tsx
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function CoinChart({
  prices,
  title = "Price Chart",
}: {
  prices: number[];
  title?: string;
}) {
  return (
    <Line
      data={{
        labels: prices.map((_, i) => `Point ${i + 1}`),
        datasets: [
          {
            label: "Price (USD)",
            data: prices,
            borderColor: "rgba(75,192,192,1)",
            backgroundColor: "rgba(75,192,192,0.2)",
            fill: true,
            tension: 0.4,
          },
        ],
      }}
      options={{
        responsive: true,
        plugins: {
          legend: { position: "top" },
          title: { display: true, text: title },
        },
        scales: {
          x: { display: false },
          y: { beginAtZero: false },
        },
      }}
    />
  );
}
