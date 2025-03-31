import React from "react";
import { Line } from "react-chartjs-2";

const LineChart = ({ data }) => {
  const labels = data.map((point) => point.date);
  const values = data.map((point) => point.value);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Balance Over Time",
        data: values,
        borderColor: "#36A2EB",
        fill: false,
      },
    ],
  };

  return (
    <>
      <Line data={chartData} />
    </>
  );
};

export default LineChart;
