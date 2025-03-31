import React from "react";
import { Pie } from "react-chartjs-2";

const PieChart = ({ data }) => {
  const chartData = {
    labels: ["Income", "Expenses"],
    datasets: [
      {
        label: "Income vs Expenses",
        data: [data.income, data.expenses],
        backgroundColor: ["#36A2EB", "#FF6384"],
      },
    ],
  };

  return (
    <>
      <Pie data={chartData} />
    </>
  );
};

export default PieChart;
