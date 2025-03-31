import React from "react";
import { Bar } from "react-chartjs-2";

const BarChart = ({ data }) => {
  const labels = Object.keys(data);
  const values = Object.values(data);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Expenses by Category",
        data: values,
        backgroundColor: "#FF6384",
      },
    ],
  };

  return (
    <>
      <Bar data={chartData} />
    </>
  );
};

export default BarChart;
