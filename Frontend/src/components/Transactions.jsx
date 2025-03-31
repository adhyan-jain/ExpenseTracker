import React, { useEffect, useState } from "react";
import BarChart from "./Charts/BarChart";

const Transactions = ({ userEmail }) => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState({});

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(`/api/transactions?email=${userEmail}`);
        const data = await response.json();
        setTransactions(data);

        // Calculate category totals for bar chart
        const categoryTotals = {};
        data.forEach((transaction) => {
          if (transaction.type === "expense") {
            categoryTotals[transaction.category] =
              (categoryTotals[transaction.category] || 0) +
              parseFloat(transaction.amount);
          }
        });
        setCategories(categoryTotals);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, [userEmail]);

  return (
    <div className="transactions">
      {/* Filter Section */}
      {/* Add filters here if needed */}

      {/* Bar Chart Section */}
      <div className="card">
        <h2>Expenses by Category</h2>
        {Object.keys(categories).length > 0 ? (
          <BarChart data={categories} />
        ) : (
          <p>No expenses to display.</p>
        )}
      </div>

      {/* Transaction List */}
      <div className="card">
        <h2>All Transactions</h2>
        {transactions.map((transaction) => (
          <p key={transaction.id}>
            {transaction.category}: ${transaction.amount} on{" "}
            {transaction.date}
          </p>
        ))}
      </div>
    </div>
  );
};

export default Transactions;
