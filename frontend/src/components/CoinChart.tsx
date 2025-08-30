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
  Filler,
} from "chart.js";
import { alpha, useTheme } from "@mui/material";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function CoinChart({
  prices,
  title = "Price Chart",
  isPositive = true,
}: {
  prices: number[];
  title?: string;
  isPositive?: boolean;
}) {
  const theme = useTheme();
  const chartColor = isPositive
    ? theme.palette.success.main
    : theme.palette.error.main;

  // Generate dates for the last 30 days
  const dates = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    dates.push(
      date.toLocaleDateString(undefined, { month: "short", day: "numeric" })
    );
  }

  return (
    <Line
      data={{
        labels: dates,
        datasets: [
          {
            label: "Price (USD)",
            data: prices,
            borderColor: chartColor,
            backgroundColor: alpha(chartColor, 0.1),
            fill: true,
            tension: 0.4,
            pointBackgroundColor: chartColor,
            pointBorderColor: theme.palette.background.paper,
            pointBorderWidth: 2,
            pointRadius: 3,
            pointHoverRadius: 6,
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: !!title,
            text: title,
            color: theme.palette.text.secondary,
            font: {
              size: 16,
              weight: "500",
            },
          },
          tooltip: {
            mode: "index",
            intersect: false,
            backgroundColor: theme.palette.background.paper,
            titleColor: theme.palette.text.primary,
            bodyColor: theme.palette.text.primary,
            borderColor: theme.palette.divider,
            borderWidth: 1,
            padding: 12,
            boxPadding: 6,
            usePointStyle: true,
            callbacks: {
              label: function (context) {
                return `$${context.parsed.y.toFixed(2)}`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
              drawBorder: false,
            },
            ticks: {
              color: theme.palette.text.secondary,
              maxRotation: 0,
              autoSkip: true,
              maxTicksLimit: 6,
            },
          },
          y: {
            grid: {
              color: theme.palette.divider,
              drawBorder: false,
            },
            ticks: {
              color: theme.palette.text.secondary,
              callback: function (value) {
                return "$" + value;
              },
            },
          },
        },
        interaction: {
          mode: "nearest",
          axis: "x",
          intersect: false,
        },
      }}
    />
  );
}
