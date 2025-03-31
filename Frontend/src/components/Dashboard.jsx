import React, { useEffect, useState } from "react";
import PieChart from "./Charts/PieChart";
import LineChart from "./Charts/LineChart";

const Dashboard = ({ userEmail }) => {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/dashboard?email=${userEmail}`);
        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, [userEmail]);

  if (!dashboardData) return <div>Loading...</div>;

  return (
    <div className="dashboard">
      {/* Summary Section */}
      <div className="card summary-card">
        <h2>Summary</h2>
        <p>Balance: ${dashboardData.balance}</p>
        <p>Total Income: ${dashboardData.totalIncome}</p>
        <p>Total Expenses: ${dashboardData.totalExpenses}</p>
      </div>

      {/* Pie Chart Section */}
      <div className="card">
        <h2>This Month's Income vs Expenses</h2>
        <PieChart data={dashboardData.thisMonth} />
      </div>

      {/* Line Chart Section */}
      <div className="card">
        <h2>Balance Over Time</h2>
        <LineChart data={dashboardData.balanceHistory} />
      </div>
    </div>
  );
};

export default Dashboard;
