import { useState } from "react";
import { Search, Plus, Menu } from "lucide-react"; // Icons
import "./Sidebar.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      {/* Sidebar Toggle Button */}
      <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
        {/* Search Input */}
        <div className="search-container">
          <Search size={18} className="icon" />
          <input type="text" placeholder="Search chat history..." />
        </div>

        {/* New Chat Button */}
        <button className="new-chat-btn">
          <Plus size={18} />
          New Chat
        </button>

        {/* Chat History (Will be updated dynamically) */}
        <div className="chat-history">
          <h4>Chat History</h4>
          <ul id="chatList"></ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
