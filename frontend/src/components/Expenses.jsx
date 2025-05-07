import { useState, useEffect } from "react";
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
import "./Expenses.css";

export default function ExpenseManager() {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [maxExpense, setMaxExpense] = useState(null);
  const [tempMaxExpense, setTempMaxExpense] = useState("");
  const [ExpensesDataFromLocalStorage, setExpensesDataFromLocalStorage] = useState([]);

  useEffect(() => {
    const userHistory = localStorage.getItem("userHistory");
    if (userHistory) {
      const parsedHistory = JSON.parse(userHistory);
      if (parsedHistory) {
        if (parsedHistory.expenses) {
          const updatedExpenses = parsedHistory.expenses.map((expense) => ({
            ...expense,
            id: expense.id || crypto.randomUUID(),
          }));
          setExpensesDataFromLocalStorage(updatedExpenses);
          parsedHistory.expenses = updatedExpenses;
        }

        if (parsedHistory.maxExpense) {
          setMaxExpense(parsedHistory.maxExpense);
        }

        localStorage.setItem("userHistory", JSON.stringify(parsedHistory));
      }
    }
  }, []);

  const handleSubmit = async () => {
    if (!maxExpense) return;
    if (typeof name !== "string" || name.trim() === "" || String(amount).trim() === "") return;

    const user = localStorage.getItem("userEmail");
    const userID = user?.split("@")[0] || "unknown";

    if (editingId) {
      const updatedExpenses = ExpensesDataFromLocalStorage.map((expense) =>
        expense.id === editingId
          ? { ...expense, reason: name, amount: parseFloat(amount) }
          : expense
      );
      setExpensesDataFromLocalStorage(updatedExpenses);
      const _history = JSON.parse(localStorage.getItem("userHistory")) || { expenses: [] };
      _history.expenses = updatedExpenses;
      localStorage.setItem("userHistory", JSON.stringify(_history));
      setEditingId(null);
      setName("");
      setAmount("");
      return;
    }

    const expenseData = {
      id: crypto.randomUUID(),
      user_id: userID,
      date: new Date().toISOString(),
      amount: parseFloat(amount),
      reason: name,
    };

    try {
      const response = await fetch("http://localhost:5001/api/expense", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expenseData),
      });

      const text = await response.text();
      const data = JSON.parse(text);

      if (response.ok) {
        const updatedExpenses = [expenseData, ...ExpensesDataFromLocalStorage];
        setExpensesDataFromLocalStorage(updatedExpenses);
        const _history = JSON.parse(localStorage.getItem("userHistory")) || { expenses: [] };
        _history.expenses = updatedExpenses;
        localStorage.setItem("userHistory", JSON.stringify(_history));
      } else {
        alert(data.message || "Failed to add expense");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while adding expense");
    }

    setName("");
    setAmount("");
  };

  const handleEdit = (expense) => {
    setName(expense.reason);
    setAmount(expense.amount);
    setEditingId(expense.id);
  };

  const handleDelete = (idToDelete) => {
    const updatedExpenses = ExpensesDataFromLocalStorage.filter((e) => e.id !== idToDelete);
    setExpensesDataFromLocalStorage(updatedExpenses);
    const _history = JSON.parse(localStorage.getItem("userHistory")) || { expenses: [] };
    _history.expenses = updatedExpenses;
    localStorage.setItem("userHistory", JSON.stringify(_history));
  };

  const handleSetMaxExpense = () => {
    const max = parseFloat(tempMaxExpense);
    if (!isNaN(max) && max > 0) {
      setMaxExpense(max);
      const _history = JSON.parse(localStorage.getItem("userHistory")) || {};
      _history.maxExpense = max;
      localStorage.setItem("userHistory", JSON.stringify(_history));
      setTempMaxExpense("");
    }
  };

  const totalExpense = ExpensesDataFromLocalStorage.reduce(
    (acc, curr) => acc + parseFloat(curr.amount || 0),
    0
  );

  const chartData = ExpensesDataFromLocalStorage.map((expenseItem) => ({
    date: new Date(expenseItem.date).toLocaleDateString(),
    amount: expenseItem.amount,
  }));

  return (
    <div className="container">
      <nav className="navbar">
        <div className="company-container">
          <div className="company-text" />
        </div>
        <span><BackButton /></span>
        <h1 className="navbar-title">Expense Manager</h1>
      </nav>

      <div className="main-content">
        <div className="chart-container">
          <h2 className="chart-title">Expense Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <XAxis
                dataKey="date"
                axisLine={true}
                tickLine={false}
                ticks={[new Date().toLocaleDateString()]} // only show current date
                tickFormatter={() => {
                  const now = new Date();
                  return now.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  }); // "May 7, 2025"
                }}
                interval={0}
              />
              <YAxis />
              <Tooltip />
              <CartesianGrid strokeDasharray="3 3" />
              <Line type="monotone" dataKey="amount" stroke="#ff4500" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="expense-section">
          {/* Max Expense Setup */}
          <div className="input-container">
            <input
              className="input-field"
              placeholder="Set Maximum Expense"
              type="number"
              value={tempMaxExpense}
              onChange={(e) => setTempMaxExpense(e.target.value)}
            />
            <button className="btn" onClick={handleSetMaxExpense}>Set Maximum Expense</button>
          </div>

          {/* Display Max Expense */}
          {maxExpense && (
            <div style={{ marginTop: "10px", fontWeight: "bold" }}>
              Your Maximum Expense Limit is: <span style={{ color: "#007bff" }}>PKR {maxExpense}</span>
            </div>
          )}

          {/* Expense Input */}
          {maxExpense ? (
            <>
              <div className="input-container">
                <input
                  className="input-field"
                  placeholder="Expense Name"
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
              {totalExpense > maxExpense && (
                <div style={{ color: "red", marginTop: "10px", fontWeight: "bold" }}>
                  You reached your maximum expense
                </div>
              )}
            </>
          ) : (
            <div style={{ color: "#888", fontStyle: "italic", marginTop: "10px" }}>
              Please set your maximum expense limit first to start adding expenses.
            </div>
          )}

          {/* History */}
          <ul className="expense-list">
            <h2 className="history-title">History</h2>
            {ExpensesDataFromLocalStorage.map((expense) => (
              <li key={expense.id} className="expense-item">
                <div>
                  <span className="expense-name">{expense.reason}</span> - PKR {expense.amount} - (Added at{" "}
                  {new Date(expense.date).toLocaleString()})
                </div>
                <div className="btn-group">
                  <button onClick={() => handleEdit(expense)} className="edit-btn">
                    <Pencil size={18} />
                  </button>
                  <button onClick={() => handleDelete(expense.id)} className="delete-btn">
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
