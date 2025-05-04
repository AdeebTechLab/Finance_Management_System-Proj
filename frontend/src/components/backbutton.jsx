import { useNavigate } from "react-router-dom";
import './backbutton.css'

export default function BackButton() {
  const navigate = useNavigate();

  return (
    <button 
      onClick={() => navigate(-1)} 
      className="back-button"
    >
      🔙 Go Back
    </button>
  );
}
