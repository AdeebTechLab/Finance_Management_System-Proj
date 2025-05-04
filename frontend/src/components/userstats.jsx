import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./userstats.css";
import BackButton from "./backbutton";

export default function SummaryAnalysis() {
  const [income, setIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [avgExpense, setAvgExpense] = useState(0);
  const [maxExpense, setMaxExpense] = useState(null);
  const [minExpense, setMinExpense] = useState(null);
  const [savingsRate, setSavingsRate] = useState(0);
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const userHistory = JSON.parse(localStorage.getItem("userHistory")) || {};
    const loadedBudgets = userHistory.budget || [];
    const loadedExpenses = userHistory.expenses || []; 

    console.log("Total Budget: ", loadedBudgets)
    console.log("Total expneses: ", loadedExpenses)

    setBudgets(loadedBudgets);
    setExpenses(loadedExpenses);

    const totalIncome = loadedBudgets.reduce((acc, budget) => acc + Number(budget.amount), 0);
    const totalExp = loadedExpenses.reduce((acc, expense) => acc + Number(expense.amount), 0);
    
    console.log("Total Budget: ", totalIncome)
    console.log("Total expneses: ", totalExp)

    setIncome(totalIncome);
    setTotalExpenses(totalExp);

    if (loadedExpenses.length > 0) {
      setAvgExpense((totalExp / loadedExpenses.length).toFixed(2));
      const sortedExpenses = [...loadedExpenses].sort((a, b) => Number(a.amount) - Number(b.amount));
      setMinExpense(sortedExpenses[0]);
      setMaxExpense(sortedExpenses[sortedExpenses.length - 1]);
    } else {
      setAvgExpense(0);
      setMinExpense(null);
      setMaxExpense(null);
    }

    if (totalIncome > 0) {
      setSavingsRate(((totalIncome - totalExp) / totalIncome * 100).toFixed(2));
    } else {
      setSavingsRate(0);
    }
  }, []);

  const downloadPDF = () => {
    const input = document.getElementById("summary-report");
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      pdf.save("Financial_Summary.pdf");
    });
  };

  return (
    <div className="summary-container">


 <nav className="navbar">
       



        <span> <BackButton/> </span>
        <h1 className="navbar-title">Financial Summary & Analysis</h1>
        
      </nav>

      



      
      <button onClick={downloadPDF} className="pdf-button">📄 Download PDF Report</button>
      <div id="summary-report" className="summary-card">
        <h2 className="section-title">Overview</h2>
        <p className="summary-item">📌 Total Income: <span>${income}</span></p>
        <p className="summary-item">💸 Total Expenses: <span>${totalExpenses}</span></p>
        <p className={`summary-item ${income - totalExpenses >= 0 ? "positive" : "negative"}`}>
          {income - totalExpenses >= 0 ? "📈 Net Savings" : "📉 Net Deficit"}: <span>${Math.abs(income - totalExpenses)}</span>
        </p>
        <p className="summary-item">📊 Savings Rate: <span>{savingsRate}%</span></p>

        <h2 className="section-title">Expense Analysis</h2>
        <p className="summary-item">📅 Average Daily Expense: <span>${avgExpense}</span></p>
        {maxExpense && <p className="summary-item">🔺 Highest Expense: <span>${maxExpense.amount}</span> on {maxExpense.name}</p>}
        {minExpense && <p className="summary-item">🔻 Lowest Expense: <span>${minExpense.amount}</span> on {minExpense.name}</p>}
      </div>
    </div>
  );
}
