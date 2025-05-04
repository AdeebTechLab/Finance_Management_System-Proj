import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import BackButton from "./backbutton";

export default function FinanceGoals({ income, totalExpenses }) {
  const [goals, setGoals] = useState([]);
  const [goalName, setGoalName] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [goalDeadline, setGoalDeadline] = useState("");

  const savings = income - totalExpenses; // Remaining savings

  // 📌 Function to fetch goals history from local storage
  useEffect(() => {
    const storedHistory = localStorage.getItem("userHistory");
    if (storedHistory) {
      try {
        const history = JSON.parse(storedHistory);
        setGoals(Array.isArray(history.goals) ? history.goals : []); // Ensure it's an array 
      } catch (error) {
        console.error("Error parsing local storage data:", error);
        setGoals([]); // Reset to empty array if parsing fails
      }
    } else {
      setGoals([]); // Ensure goals is always an array
    }
  }, []);

  // 📌 Function to add a new financial goal
  const addGoal = async () => {
    if (!goalName || !goalAmount || !goalDeadline)
      return alert("Please enter all fields!");
    const user = localStorage.getItem("userEmail");
    const userID = user.split("@")[0];

    const newGoal = {
      user_id: userID,
      name: goalName,
      amount: Number(goalAmount),
      deadline: goalDeadline,
      progress: Math.min((savings / Number(goalAmount)) * 100, 100), // Percentage of goal achieved
    };

    try {
      const response = await fetch("http://localhost:5001/api/goal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newGoal),
      });

      const text = await response.text();
      const data = JSON.parse(text);
      if (response.ok) {
        setGoals((prev) => [...prev, data]);
      } else {
        alert(data.message || "Failed to add goal");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while adding the goal");
    }

    // Save new goal to local storage
    const updatedGoals = [...(Array.isArray(goals) ? goals : []), newGoal];
    const userHistory = JSON.parse(localStorage.getItem("userHistory")) || {};
    userHistory.goals = updatedGoals;
    localStorage.setItem("userHistory", JSON.stringify(userHistory));
    setGoals(updatedGoals);

    setGoalName("");
    setGoalAmount("");
    setGoalDeadline("");
  };

  // 📌 Function to download PDF of goals
  const downloadPDF = () => {
    const input = document.getElementById("goals-report");

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      pdf.save("Finance_Goals_Report.pdf");
    });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6 bg-gradient-to-b from-gray-50 to-white rounded-xl shadow-lg">
      <div className="flex items-center justify-between">



      <nav className="navbar">
       



       <span> <BackButton/> </span>
       <h1 className="navbar-title"> Financial Goals Tracker</h1>
       
     </nav>
 



      </div>

      <div className="p-6 bg-white border border-green-100 rounded-xl shadow-lg space-y-5 transform transition-all duration-300 hover:shadow-xl">
        <h2 className="text-xl font-semibold text-green-700 border-b border-green-100 pb-3">Set a New Goal</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <input type="text" placeholder="Goal Name (e.g., Buy a Car)" value={goalName} onChange={(e) => setGoalName(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg" />
          <input type="number" placeholder="Target Amount ($)" value={goalAmount} onChange={(e) => setGoalAmount(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg" />
          <input type="date" value={goalDeadline} onChange={(e) => setGoalDeadline(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg" />
        </div>
        <button onClick={addGoal} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-md">➕ Add Goal</button>
      </div>

      <button onClick={downloadPDF} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md">📄 Download Goals Report</button>

      <div id="goals-report" className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800 border-b border-gray-200 pb-3">Your Financial Goals</h2>
        {goals.length === 0 ? (
          <p className="text-gray-500 text-center">You have not set any goals yet.</p>
        ) : (
          goals.map((goal, index) => (
            <div key={index} className="p-5 border border-gray-200 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold">{goal.name}</h3>
              <p>Target: ${goal.amount}</p>
              <p>Deadline: {new Date(goal.deadline).toLocaleDateString()}</p>
              
            </div>
          ))
        )}
      </div>
    </div>
  );
}
