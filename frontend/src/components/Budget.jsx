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

export default function BudgetManager() {
  const [budgetDataFromLocalStorage, setBudgetDataFromLocalStorage] = useState([]);
  const [history, setHistory] = useState([]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const userHistory = localStorage.getItem("userHistory");
    if (userHistory) {
      const parsedHistory = JSON.parse(userHistory);
      if (parsedHistory?.budget) {
        setBudgetDataFromLocalStorage(parsedHistory.budget);
      }
    }
  }, []);

  const handleSubmit = async () => {
    if (!name.trim() || !String(amount).trim()) return;

    const user = localStorage.getItem("userEmail");
    if (!user) {
      alert("User is not logged in");
      return;
    }
    const userID = user.split("@")[0];

    if (editingId) {
      const updatedBudgets = budgetDataFromLocalStorage.map((b) =>
        b._id === editingId
          ? { ...b, source: name, amount: parseFloat(amount) }
          : b
      );

      setBudgetDataFromLocalStorage(updatedBudgets);

      const _history = JSON.parse(localStorage.getItem("userHistory")) || {
        budget: [],
      };
      _history.budget = updatedBudgets;
      localStorage.setItem("userHistory", JSON.stringify(_history));

      setEditingId(null);
      setName("");
      setAmount("");
      return;
    }

    const budgetData = {
      _id: Date.now(), // Temporary ID for frontend
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
        const updatedBudgets = [budgetData, ...budgetDataFromLocalStorage];
        setHistory((prev) => [budgetData, ...prev]);
        setBudgetDataFromLocalStorage(updatedBudgets);

        const _history =
          JSON.parse(localStorage.getItem("userHistory")) || { budget: [] };
        _history.budget = updatedBudgets;
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
    setName(budget.source || budget.name || "");
    setAmount(budget.amount);
    setEditingId(budget._id);
  };

  const handleDelete = (id) => {
    const updatedBudgets = budgetDataFromLocalStorage.filter(
      (budget) => budget._id !== id
    );
    setBudgetDataFromLocalStorage(updatedBudgets);

    const _history = JSON.parse(localStorage.getItem("userHistory")) || {
      budget: [],
    };
    _history.budget = updatedBudgets;
    localStorage.setItem("userHistory", JSON.stringify(_history));
  };

  const chartData = budgetDataFromLocalStorage.map((budgetItem) => ({
    date: new Date(budgetItem.date).toLocaleDateString(),
    amount: budgetItem.amount,
  }));

  return (
    <div className="container">
      <nav className="navbar">
        <span>
          <BackButton />
        </span>
        <h1 className="navbar-title">Budget Manager</h1>
      </nav>

      <div className="main-content">
        <div className="chart-container">
          <h2 className="chart-title">Budget Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
  <LineChart data={chartData}>
    <XAxis
      dataKey="date"
      axisLine={false}
      tickLine={false}
      ticks={[new Date().toLocaleDateString()]}
      tickFormatter={() => {
        const now = new Date();
        return now.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        });
      }}
      tick={{
        fill: "#808080",
        fontSize: 18,
        fontWeight: "bold",
        textAnchor: "middle",
        letterSpacing: "1px",
      }}
      style={{
        transform: "translateX(-50%)", // To center align the tick
        left: "50%",
        position: "absolute", 
        bottom: -20,  // Adjust the vertical position if needed
      }}
      interval={0}
    />
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
                  {budget.amount} (Added at {new Date(budget.date).toLocaleString()})
                </div>
                <div className="btn-group">
                  <button
                    onClick={() => handleEdit(budget)}
                    className="edit-btn"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(budget._id)}
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
