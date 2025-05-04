import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Signup from "./components/register";
import Login from "./components/login";
import Dashboard from "./components/Dashboard";
import BudgetManager from "./components/Budget";
import ExpensesManager from "./components/Expenses";
import InvestmentTracker from "./components/Investment";
import FinanceGoals from "./components/financeGoals";
import AdminPanel from "./components/admin_panel"; 
import LossProfit from './components/loss-profit'
import SummaryAnalysis from './components/userstats'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const authStatus = localStorage.getItem("isAuthenticated");
    setIsAuthenticated(authStatus === "true");
  }, []);

  // Function to update authentication status after login
  const handleLogin = () => {
    localStorage.setItem("isAuthenticated", "true");
    setIsAuthenticated(true); 
  }; 
  const user = JSON.parse(localStorage.getItem("user")); // Fetch logged-in user data


  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route 
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route path="/budget" element={<BudgetManager />} />
        <Route path="/expenses" element={<ExpensesManager />} />
        <Route path="/investment" element={<InvestmentTracker />} />
        <Route path="/financegoal" element={<FinanceGoals />} />
        <Route path="/userstats" element={<SummaryAnalysis />} />
        <Route path="/Lossprofit" element={<LossProfit />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

export default App;
