import { useEffect, useState } from "react";
import { Line, Pie } from "react-chartjs-2";
import "chart.js/auto"; 
import './loss-profit.css'
import BackButton from "./backbutton";
 
export default function LossProfit() {
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);

  useEffect(() => {
    const userHistory = JSON.parse(localStorage.getItem("userHistory")) || {};
    const budgetsData = userHistory.budget || [];
    const expensesData = userHistory.expenses || [];

    setBudgets(budgetsData);
    setExpenses(expensesData);
    setIncome(budgetsData.reduce((acc, budget) => acc + Number(budget.amount), 0));
    setTotalExpenses(expensesData.reduce((acc, expense) => acc + Number(expense.amount), 0));
  }, []);

  const profitLoss = income - totalExpenses;

  const pieData = {
    labels: expenses.map((exp) => exp.name),
    datasets: [
      {
        data: expenses.map((exp) => Number(exp.amount)),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#8E44AD"],
      },
    ],
  };

  const lineData = {
    labels: budgets.map((_, index) => `Budget ${index + 1}`),
    datasets: [
      {
        label: "Budget Amount",
        data: budgets.map((budget) => Number(budget.amount)),
        fill: false,
        backgroundColor: "#FFCE56",
        borderColor: "#FFCE56",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" },
    },
  };

  return (
    <div className="">
      {/* Navbar */}
      <nav className="navbar">
        
        <span> <BackButton/> </span>
        <h1 className="navbar-title">Profit & Loss Summary</h1>
      </nav>
      
      <div className="container">
        <div className="summary-box">
          <p className="text-lg font-semibold">Income: ${income}</p>
          <p className="text-lg font-semibold">Expenses: ${totalExpenses}</p>
          <p className={`text-lg font-semibold ${profitLoss >= 0 ? "text-green-500" : "text-red-500"}`}>
            {profitLoss >= 0 ? "Profit" : "Loss"}: ${Math.abs(profitLoss)}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white border rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Expenses Breakdown</h2>
            <div className="w-full h-64">
              <Pie data={pieData} options={chartOptions} />
            </div>
          </div>
          <div className="p-6 bg-white border rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Budget Trend</h2>
            <div className="w-full h-64">
              <Line data={lineData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
