import React from "react";
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

// Register the components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PriceHistoryChart = ({ data }) => {
  // Prepare chart data
  const chartData = {
    labels: data.map((item) => item.date), // Dates
    datasets: [
      {
        label: "Stablecoin Price",
        data: data.map((item) => item.price), // Prices
        fill: false,
        borderColor: "#2563EB",
        tension: 0.1, // Smooth curve
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        title: {
          display: true,
          text: "Price (USD)",
        },
        min: 0, // Ensure the y-axis starts from 0
      },
    },
  };

  return (
    <div className="mx-w-[900px] w-full bg-white shadow-lg rounded-lg p-6">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default PriceHistoryChart;
