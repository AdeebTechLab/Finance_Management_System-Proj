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
import "./Expenses.css"; // Importing the CSS file

const expenseReducer = (state, action) => {
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
      return state.map((expense) =>
        expense.id === action.id
          ? { ...expense, name: action.name, amount: parseFloat(action.amount) }
          : expense
      );
    case "DELETE":
      return state.filter((expense) => expense.id !== action.id);
    default:
      return state;
  }
};

export default function ExpenseManager() {
  const [expenses, dispatch] = useReducer(expenseReducer, []);
  const [history, setHistory] = useState([]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [ExpensesDataFromLocalStorage, setExpensesDataFromLocalStorage] =
    useState([]);

  useEffect(() => {
    const userHistory = localStorage.getItem("userHistory");
    if (userHistory) {
      const parsedHistory = JSON.parse(userHistory);
      if (parsedHistory && parsedHistory.expenses) {
        setExpensesDataFromLocalStorage(parsedHistory.expenses);
      }
    }
  }, []);

  const handleSubmit = async () => {
    if (!name.trim() || !amount.trim()) return;
  
    const user = localStorage.getItem("userEmail");
    const userID = user.split("@")[0];
    const expenseData = {
      user_id: userID,
      date: new Date().toISOString(),
      amount: parseFloat(amount),
      reason: name,
    };
  
    try {
      const response = await fetch("http://localhost:5001/api/expense", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(expenseData),
      });
      console.log("Raw response:", response);
  
      const text = await response.text();
      console.log("Response body:", text);
  
      const _history = JSON.parse(localStorage.getItem("userHistory")) || { expenses: [] };
  
      const data = JSON.parse(text);
      if (response.ok) {
        const updatedExpenses = [expenseData, ...ExpensesDataFromLocalStorage];
  
        // Update history state
        setHistory((prev) => [expenseData, ...prev]);
  
        // Update local storage
        _history.expenses = updatedExpenses;
        localStorage.setItem("userHistory", JSON.stringify(_history));
  
        // **Update ExpensesDataFromLocalStorage state**
        setExpensesDataFromLocalStorage(updatedExpenses);
      } else {
        alert(data.message || "Failed to add budget");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while adding expense");
    }
  
    setName("");
    setAmount("");
  };
  
  const handleEdit = (expense) => {
    setName(expense.name);
    setAmount(expense.amount);
    setEditingId(expense.id);
  };

  const filteredExpenses = expenses.filter((expense) =>
    expense.name.toLowerCase().includes(search.toLowerCase())
  );

  // Prepare data for the line chart (group by date)
  const chartData = ExpensesDataFromLocalStorage.map((expenseItem) => ({
    date: new Date(expenseItem.date).toLocaleDateString(),
    amount: expenseItem.amount,
  }));

  return (
    <div className="container">
      {/* Navbar */}

      <nav className="navbar">
        <div className="company-container">

          <div className="company-text">


          </div>
        </div>
        <span> <BackButton/> </span>
        <h1 className="navbar-title">Expense Manager</h1>
        
      </nav>

      {/* Main Content with Sidebar Chart */}
      <div className="main-content">
        {/* Chart Section */}
        <div className="chart-container">
          <h2 className="chart-title">Expense Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <CartesianGrid strokeDasharray="3 3" />
              <Line type="monotone" dataKey="amount" stroke="#ff4500" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Expense Management Section */}
        <div className="expense-section">
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

          <ul className="expense-list">
            <h2 className="history-title">History</h2>
            {ExpensesDataFromLocalStorage.map((expense) => (
              <li key={expense.id} className="expense-item">
                <div>
                  <span className="expense-name">{expense.reason}</span> - PKR
                  {expense.amount} - (Added at {expense.date})
                </div>
                <div className="btn-group">
                  <button
                    onClick={() => handleEdit(expense)}
                    className="edit-btn"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => dispatch({ type: "DELETE", id: expense.id })}
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
