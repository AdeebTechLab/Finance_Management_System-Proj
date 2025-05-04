import { useState, useReducer, useEffect } from "react";
import { Pencil, Trash } from "lucide-react";
import BackButton from "./backbutton";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid, 
  ResponsiveContainer,
} from "recharts";
import "./Budget.css";

const budgetReducer = (state, action) => {
  switch (action.type) {
    case "ADD":
      return [
        {
          id: Date.now(),
          name: action.name,
          amount: parseFloat(action.amount),
        },
        ...state,
      ];
    case "EDIT":
      return state.map((budget) =>
        budget.id === action.id
          ? { ...budget, name: action.name, amount: parseFloat(action.amount) }
          : budget
      );
    case "DELETE":
      return state.filter((budget) => budget.id !== action.id);
    default:
      return state;
  }
};

export default function BudgetManager() {
  const [budgets, dispatch] = useReducer(budgetReducer, []);
  const [history, setHistory] = useState([]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [budgetDataFromLocalStorage, setBudgetDataFromLocalStorage] = useState(
    []
  );

  // Fetch userHistory from localStorage and set budget data
  useEffect(() => {
    const userHistory = localStorage.getItem("userHistory");
    if (userHistory) {
      const parsedHistory = JSON.parse(userHistory);
      if (parsedHistory && parsedHistory.budget) {
        setBudgetDataFromLocalStorage(parsedHistory.budget);
      }
    }
  }, []);
  const _history = JSON.parse(localStorage.getItem("userHistory"));

  const handleSubmit = async () => {
    if (!name.trim() || !amount.trim()) return;
  
    const user = localStorage.getItem("userEmail");
    if (!user) {
      alert("User is not logged in");
      return;
    }
    const userID = user.split("@")[0];
  
    const budgetData = {
      user_id: userID,
      date: new Date().toISOString(),
      amount: parseFloat(amount),
      source: name,
    };
  
    try {
      const response = await fetch("http://localhost:5001/api/budget", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(budgetData),
      });
  
      const text = await response.text();
      const data = JSON.parse(text);
      
      if (response.ok) {
        // Update history and budget data state immediately
        setHistory((prev) => [budgetData, ...prev]);
  
        const updatedBudget = [budgetData, ...budgetDataFromLocalStorage];
        setBudgetDataFromLocalStorage(updatedBudget); // Ensures re-render
        _history.budget = updatedBudget;
        localStorage.setItem("userHistory", JSON.stringify(_history));
      } else {
        alert(data.message || "Failed to add budget");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while adding budget");
    }
  
    setName(""); 
    setAmount("");
  };
  
  const handleEdit = (budget) => {
    setName(budget.name);
    setAmount(budget.amount);
    setEditingId(budget.id);
  };

  const filteredBudgets = budgets.filter((budget) =>
    budget.name.toLowerCase().includes(search.toLowerCase())
  );

  // Chart data based on budget from local storage
  const chartData = budgetDataFromLocalStorage.map((budgetItem) => ({
    date: new Date(budgetItem.date).toLocaleDateString(),
    amount: budgetItem.amount,
  }));

  return (




    <div className="container">
      <nav className="navbar">
       



        <span> <BackButton/> </span>
        <h1 className="navbar-title">Budget Manager</h1>
        
      </nav>






      <div className="main-content">
        <div className="chart-container">
          <h2 className="chart-title">Budget Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <CartesianGrid strokeDasharray="3 3" />
              <Line type="monotone" dataKey="amount" stroke="#007bff" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="budget-section">
          <div className="input-container">
            <input
              className="input-field"
              placeholder="Budget Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="input-field"
              placeholder="Amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <button className="btn" onClick={handleSubmit}>
              {editingId ? "Update" : "Add"}
            </button>
          </div>
          <ul className="budget-list">
            <h2 className="history-title">History</h2>
            {budgetDataFromLocalStorage.map((budget) => (
              <li key={budget._id} className="budget-item">
                <div>
                  <span className="budget-name">{budget.source}</span> - PKR{" "}
                  {budget.amount}
                  (Added at {new Date(budget.date).toLocaleString()})
                </div>
                <div className="btn-group">
                  <button
                    onClick={() => handleEdit(budget)}
                    className="edit-btn"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => dispatch({ type: "DELETE", id: budget._id })}
                    className="delete-btn"
                  >
                    <Trash size={18} />
                  </button>
                </div>
              </li>
            ))} 
          </ul>
        </div>
      </div>
    </div>
  );
}
