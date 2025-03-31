import React, { useEffect, useState } from "react";
import LineChart from "./Charts/LineChart";

const Prediction = ({ userEmail }) => {
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const response = await fetch(`/api/predictions?email=${userEmail}`);
        const data = await response.json();
        setPredictions(data);
      } catch (error) {
        console.error("Error fetching predictions:", error);
      }
    };

    fetchPredictions();
  }, [userEmail]);

  if (predictions.length === 0) return <div>Loading predictions...</div>;

  return (
    <div className="prediction">
      {/* Line Chart Section */}
      <div className="card">
        <h2>6-Month Expense Predictions</h2>
        <LineChart data={predictions} />
      </div>

      {/* Prediction Details */}
      {predictions.map((prediction) => (
        <p key={prediction.month}>
          {prediction.month}: Predicted - ${prediction.predicted.toFixed(2)}
          {prediction.actual && ` | Actual - $${prediction.actual.toFixed(2)}`}
        </p>
      ))}
    </div>
  );
};

export default Prediction;
