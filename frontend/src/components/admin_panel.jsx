import { useEffect, useState } from "react";
import { Pencil, Trash } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./admin_pannel.css";
import BackButton from "./backbutton";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/admin/users")
      .then((res) => {
        setUsers(res.data);
        setFilteredUsers(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = users.filter(
      (user) =>
        user.fullname.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
    );
    setFilteredUsers(filtered);
  };

  const handleUserClick = (userId) => {
    navigate(`/dashboard/${userId}`);
  };

  const handleDeleteUser = async (email) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5001/api/admin/users/${email}`);
      setUsers(users.filter((user) => user.email !== email));
      setFilteredUsers(filteredUsers.filter((user) => user.email !== email));
      alert("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user.");
    }
  };

  const user = localStorage.getItem("userEmail");
  const userID = user.split("@")[0];

  return (
    <div>
      <header className="header">
        <span className="welcome-text">
          Salam, Welcome back <strong>{userID}</strong>
        </span>
        <span> <BackButton /> </span>
        <input
          type="text"
          placeholder="Search by name or email"
          value={searchQuery}
          onChange={handleSearch}
          className="search-box"
        />
      </header>
      <div className="main">
        <div className="userlist">
          <h2>User List</h2>
          {filteredUsers.length > 0 ? (
            <ul>
              {filteredUsers.map((user) => (
                <li key={user._id} className="clickable-user-item">
                  <div className="user-info">
                    <p><strong>Name:</strong> {user.fullname}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                  </div>
                  <div className="user-actions">
                    <Pencil size={18} />
                    <Trash
                      size={18}
                      onClick={() => handleDeleteUser(user.email)}
                      className="delete-icon"
                    />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No users found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
