"use client"

import { useState, useEffect } from "react"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import BackButton from "./backbutton"

export default function InvestmentTracker() {
  const [investments, setInvestments] = useState([])
  const [company, setCompany] = useState("")
  const [type, setType] = useState("")
  const [amount, setAmount] = useState("")
  const [returns, setReturns] = useState("")
  const [investmentDataFromLocalStorage, setInvestmentDataFromLocalStorage] = useState([])

  useEffect(() => {
    const userHistory = localStorage.getItem("userHistory")
    if (userHistory) {
      const parsedHistory = JSON.parse(userHistory)
      if (parsedHistory && parsedHistory.investments) {
        setInvestmentDataFromLocalStorage(parsedHistory.investments)
      }
    }
  }, [])

  // 📌 Function to add a new investment
  const addInvestment = async () => {
    if (!company || !type || !amount || !returns) return alert("Please fill all fields!")

    const user = localStorage.getItem("userEmail")
    const userID = user.split("@")[0]
    const newInvestment = {
      user_id: userID,
      company: company,
      type: type,
      amount: Number(amount),
      returns: Number(returns),
      date: new Date().toLocaleDateString(), // 📅 Auto-generate date
    }

    try {
      const response = await fetch("http://localhost:5001/api/investment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newInvestment),
      })

      const text = await response.text()
      const data = JSON.parse(text)

      const _history = JSON.parse(localStorage.getItem("userHistory"))
      if (response.ok) {
        setInvestments((prev) => [...prev, data]) // Update investments state
        const updatedInvestments = [data, ...investmentDataFromLocalStorage]
        _history.investments = updatedInvestments
        localStorage.setItem("userHistory", JSON.stringify(_history))
        setInvestmentDataFromLocalStorage(updatedInvestments) // Update local storage investments
      } else {
        alert(data.message || "Failed to add Investment")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("An error occurred while adding Investment")
    }
    setCompany("")
    setType("")
    setAmount("")
    setReturns("")
  }

  // 📌 Function to download PDF of investments
  const downloadInvestmentPDF = () => {
    const input = document.getElementById("investment-report")

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF("p", "mm", "a4")

      const imgWidth = 190
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight)
      pdf.save("Investment_Report.pdf")
    })
  }

  return (

    <div className="max-w-[1200px] mx-auto min-h-screen px-4 md:px-6 lg:px-8 py-8 flex flex-col gap-8">
      <div className="p-6 max-w-4xl mx-auto bg-gradient-to-b from-gray-50 to-white rounded-2xl shadow-xl">



      <div className="flex items-center justify-between mb-8">




      <nav className="navbar">
       



       <span> <BackButton/> </span>
       <h1 className="navbar-title">Investment Tracker</h1>
       
     </nav>

      





      </div>



      {/* Input Fields for Adding Investments */}
      <div className="p-6 bg-white border border-indigo-100 rounded-xl shadow-lg space-y-5 mb-8 transform transition-all hover:shadow-xl">
        <h2 className="text-xl font-semibold text-indigo-700 border-b border-indigo-100 pb-3">Add New Investment</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <input
            type="text"
            placeholder="Company Name (e.g., Tesla)"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          >
            <option value="">Select Investment Type</option>
            <option value="Stocks">📊 Stocks</option>
            <option value="Crypto">💰 Crypto</option>
            <option value="Real Estate">🏡 Real Estate</option>
            <option value="Bonds">💵 Bonds</option>
            <option value="Mutual Funds">📈 Mutual Funds</option>
          </select>
          <input
            type="number"
            placeholder="Investment Amount ($)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          />
          <input
            type="number"
            placeholder="Expected Returns (%)"
            value={returns}
            onChange={(e) => setReturns(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          />
        </div>
        <button
          onClick={addInvestment}
          className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all transform hover:-translate-y-1 flex items-center justify-center"
        >
          <span className="mr-2">➕</span> Add Investment
        </button>
      </div>

      {/* PDF Download Button */}
      <button
        onClick={downloadInvestmentPDF}
        className="w-full mb-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all transform hover:-translate-y-1 flex items-center justify-center"
      >
        <span className="mr-2">📄</span> Download Investment Report
      </button>

      {/* Investments Summary */}
      <div id="investment-report" className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800 border-b border-gray-200 pb-3">Your Investments</h2>

        {investmentDataFromLocalStorage.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-gray-500">
            <svg
              className="w-16 h-16 mb-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <p className="text-lg">No investment history available.</p>
            <p className="text-sm mt-2">Start by adding your first investment above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {investmentDataFromLocalStorage.map((inv, index) => (
              <div
                key={index}
                className="p-5 border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1"
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-gray-800">{inv.company}</h3>
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">
                    {inv.type}
                  </span>
                </div>
                <div className="mt-4 space-y-2">
                  <p className="flex items-center text-gray-700">
                    <span className="mr-2">💰</span> Investment:
                    <span className="font-bold ml-2">${inv.amount}</span>
                  </p>
                  <p className="flex items-center text-gray-700">
                    <span className="mr-2">📈</span> Returns:
                    <span className="font-bold ml-2">{inv.returns}%</span>
                  </p>
                  <p className="flex items-center text-gray-700">
                    <span className="mr-2">📅</span> Date:
                    <span className="font-bold ml-2">{inv.date}</span>
                  </p>
                </div>
                <div className="mt-4">
                  <span
                    className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
                      inv.returns >= 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {inv.returns >= 0 ? "✅ Profit Expected" : "⚠️ Potential Loss"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
      </div>
  )
}

