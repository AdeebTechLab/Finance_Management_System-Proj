import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faBars,
  faHome, 
  faDollarSign,
  faBullseye,
  faSignOutAlt,
  faTachometerAlt,
} from "@fortawesome/free-solid-svg-icons";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [budget, setBudget] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [investments, setInvestments] = useState([]);
  const [goals, setGoals] = useState([]);
  const [budgetChange, setBudgetChange] = useState(null);
  const [expenseChange, setExpenseChange] = useState(null);
  const [budgetHistory, setBudgetHistory] = useState([]);
 


  const navigate = useNavigate();
  const user = localStorage.getItem("userEmail");
  const userID = user ? user.split("@")[0] : "User";

  const userHistory = JSON.parse(localStorage.getItem("userHistory")) || {};
  const _user = JSON.parse(localStorage.getItem("user")) || {};
  const isAdmin = _user.permission;
 const budgetdata = userHistory.budget



  useEffect(() => {
    if (!user) return;
  
    const userHistory = JSON.parse(localStorage.getItem("userHistory")) || {};
  
    const totalBudget = userHistory.budget
      ? userHistory.budget.reduce((acc, item) => acc + Number(item.amount), 0)
      : 0;
    const totalExpenses = userHistory.expenses
      ? userHistory.expenses.reduce((acc, item) => acc + Number(item.amount), 0)
      : 0;
    const investments = userHistory.investments || [];
    const goalList = userHistory.goals || [];
  
    const budgetHistory = userHistory.budget || [];
    const expenseHistory = userHistory.expenses || [];
    
    const Budget = userHistory.budget
      ? userHistory.budget.reduce((acc, item) => acc + Number(item.amount), 0)
      : 0;
    
    setBudget(Budget);
    setBudgetHistory(userHistory.budget || []);
  
    if (budgetHistory.length > 1) {
      const prevBudget = Number(budgetHistory[budgetHistory.length - 2]?.amount) || 0;
      const currentBudget = Number(budgetHistory[budgetHistory.length - 1]?.amount) || 0;
      const budgetDiff = ((currentBudget - prevBudget) / (prevBudget || 1)) * 100;
      setBudgetChange(budgetDiff);
    }
  
    if (expenseHistory.length > 1) {
      const prevExpense = Number(expenseHistory[expenseHistory.length - 2]?.amount) || 0;
      const currentExpense = Number(expenseHistory[expenseHistory.length - 1]?.amount) || 0;
      const expenseDiff = ((currentExpense - prevExpense) / (prevExpense || 1)) * 100;
      setExpenseChange(expenseDiff);
    }
  
    setBudget(totalBudget);
    setExpenses(totalExpenses);
    setInvestments(investments);
    setGoals(goalList);
  }, [user]); // Adding `user` as a dependency
    const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };
  const _isAdmin = false;
  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <nav
        className={`side-bar hover:text#007bff ${isExpanded ? "expanded" : ""}`}
      >
        <div className="toggle-btn" onClick={toggleSidebar}>
          <FontAwesomeIcon icon={faBars} />
        </div>
        <ul className="menu">
          <li
            className="menu-item"
            title="Dashboard"
            onClick={() => navigate("/dashboard")}
          >
            <FontAwesomeIcon icon={faHome} className="icon" />
            {isExpanded && <span>Dashboard</span>}
          </li>
          <li
            className="menu-item"
            title="Dashboard"
            onClick={() => isAdmin &&               navigate("/admin")}
          >
            <FontAwesomeIcon icon={faTachometerAlt} className="icon" />
            {isExpanded && <span>Admin Pannel</span>}
          </li>
          <li
            className="menu-item"
            title="Budgets"
            onClick={() => navigate("/budget")}
          >
            <FontAwesomeIcon icon={faDollarSign} className="icon" />
            {isExpanded && <span>Budgets</span>}
          </li>
          <li
            className="menu-item"
            title="Goals"
            onClick={() => navigate("/financegoal")}
          >
            <FontAwesomeIcon icon={faBullseye} className="icon" />
            {isExpanded && <span>Goals</span>}
          </li>
          <li
            className="menu-item"
            title="Statistics"
            onClick={() => navigate("/investment")}
          >
            <FontAwesomeIcon icon={faChartLine} className="icon" />
            {isExpanded && <span>Statistics</span>}
          </li>
          <li
            className="menu-item logout"
            title="Logout"
            onClick={handleLogout}
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="icon" />
            {isExpanded && <span>Logout</span>}
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <header className="header">
          <span className="welcome-text">
            <div>Salam, Welcome back <strong>{userID}</strong></div>
          </span>
        </header>

      <div className={`main-content main-dashboard ${isExpanded ? "shifted" : ""}`}>
        
        <div className="cards-container">
          <div
            className="card balance-card"
            onClick={() => navigate("/budget")}
          >
            <span className="card-title">
              <h3>Balance</h3>
            </span>
            <h2> PKR {budget.toLocaleString()}</h2>
            <div className="card-footer">
              <span></span>
              <span className="expiry-date"></span>
            </div>
          </div>
          <div
            className="card income-card"
            onClick={() => navigate("/Lossprofit")}
          >
            <span className="card-title">
              <h3>Income</h3>
            </span>
            <h2>PKR {budget.toLocaleString()}</h2>
            <div className="card-footer-inline">
              <span className="card-subtext">This week's income</span>
              <span
                className={`status ${
                  budgetChange >= 0 ? "positive" : "negative"
                }`}
              >
                {/* {budgetChange >= 0 ? `Growing +${budgetChange.toFixed(2)}%` : `Downing ${budgetChange.toFixed(2)}%`} */}
              </span>
            </div>
          </div>
          <div
            className="card expenses-card"
            onClick={() => navigate("/expenses")}
          >
            <span className="card-title">
              <h3>Expenses</h3>
            </span>
            <h2>PKR {expenses.toLocaleString()}</h2>
            <div className="card-footer-inline">
              <span className="card-subtext">This week's expenses</span>
              <span
                className={`status ${
                  expenseChange >= 0 ? "negative" : "positive"
                }`}
              >
                {/* {expenseChange >= 0 ? `Growing +${expenseChange.toFixed(2)}%` : `Downing ${expenseChange.toFixed(2)}%`} */}
              </span>
            </div>
          </div>


          {/* investment card */}
          <div
            className="card invest-card extra-width"
            onClick={() => navigate("/investment")}>
            <h2 className="card-header">Your Investments</h2>
            {/* <span>Your investment</span> */}
            <div className="invest-list-wrapper">
              <div className="invest-list">
                {investments.length > 0 ? (
                  <table className="investment-table">
                    <tbody>
                      <tr>
                        <td><h4>company</h4></td>
                        <td><h4>amount</h4></td>
                      </tr>
                      {investments.map((inv, index) => (
                        <tr key={index}>
                          <td>{inv.company}</td>
                          <td>{inv.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="no-investments">No investments yet</p>
                )}
              </div>
            </div>
          </div>




{/* BAJET card */}
<div
  className="card stats-card"
  onClick={() => navigate("/userstats")}
>
  <h2>Budget History</h2> {/* Adding Salman's name */}
  <div className="card-footer-inline">
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={budgetHistory}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="amount" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  </div>
</div>











          <div
            className="card savings-card"
            onClick={() => navigate("/financegoal")}
          >
            <h3>Set Goals</h3>
            <div className="card-footer-inline">
              {goals.length > 0 ? (
                <table className="goal-table">
                  <thead>
                    <tr>
                      <th>Goal Name</th>
                      <th>Target Amount ($)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {goals.map((goal, index) => (
                      <tr key={index}>
                        <td>{goal.name}</td>
                        <td>{new Date(goal.deadline).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No goals set</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
