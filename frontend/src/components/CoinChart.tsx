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
  timePeriod = "30d",
}: {
  prices: number[];
  title?: string;
  isPositive?: boolean;
  timePeriod?: string;
}) {
  const theme = useTheme();
  const chartColor = isPositive
    ? theme.palette.success.main
    : theme.palette.error.main;

  // Generate dates based on time period
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    let days: number;
    
    switch (timePeriod) {
      case "7d":
        days = 7;
        break;
      case "30d":
        days = 30;
        break;
      case "90d":
        days = 90;
        break;
      case "1y":
        days = 365;
        break;
      default:
        days = 30;
    }

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      
      let dateFormat: Intl.DateTimeFormatOptions;
      if (timePeriod === "1y") {
        dateFormat = { month: "short", day: "numeric" };
      } else if (timePeriod === "90d") {
        dateFormat = { month: "short", day: "numeric" };
      } else {
        dateFormat = { month: "short", day: "numeric" };
      }
      
      dates.push(date.toLocaleDateString(undefined, dateFormat));
    }
    return dates;
  };

  const dates = generateDates();

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
            pointRadius: timePeriod === "1y" ? 1 : 3,
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
              maxTicksLimit: timePeriod === "1y" ? 12 : 6,
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
