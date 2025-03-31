import React from "react";

const Sidebar = ({ activePage, setActivePage }) => {
  return (
    <div className="sidebar">
      <div className="logo">
        <i className="fas fa-wallet"></i>
        <span>Fast Budget</span>
      </div>
      <ul className="nav-menu">
        <li
          className={`nav-item ${activePage === "dashboard" ? "active" : ""}`}
          onClick={() => setActivePage("dashboard")}
        >
          <i className="fas fa-th-large"></i>
          <span>Dashboard</span>
        </li>
        <li
          className={`nav-item ${activePage === "transactions" ? "active" : ""}`}
          onClick={() => setActivePage("transactions")}
        >
          <i className="fas fa-list"></i>
          <span>Transactions</span>
        </li>
        <li
          className={`nav-item ${activePage === "prediction" ? "active" : ""}`}
          onClick={() => setActivePage("prediction")}
        >
          <i className="fas fa-chart-line"></i>
          <span>Prediction</span>
        </li>
      </ul>
      <button
        className="logout-btn"
        onClick={() => {
          localStorage.clear();
          window.location.reload();
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
