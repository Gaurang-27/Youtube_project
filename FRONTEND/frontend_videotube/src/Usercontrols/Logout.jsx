import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Logout = () => {
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // For redirection

  const handleLogout = async () => {
    try {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          setMessage("No refresh token found. Please log in again.");
          return;
        }

      // Send logout request to the backend
      await axios.post("/users/logout", { refreshToken });

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      // Show logout success message
      setMessage("Logout successful!");

      // Redirect to login page after 2 seconds
      setTimeout(() => navigate("/login"), 2000);
      
    } catch (error) {
      console.error("Logout failed:", error);
      setMessage("Failed to log out. Try again.");
    }
  };

  return (
    <div style={styles.container}>
      <button onClick={handleLogout} style={styles.button}>Logout</button>
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
};

// Styles
const styles = {
  container: { textAlign: "center", marginTop: "20px" },
  button: { padding: "10px 20px", fontSize: "18px", background: "#FF5733", color: "#fff", border: "none", cursor: "pointer", borderRadius: "5px" },
  message: { marginTop: "10px", fontSize: "16px", color: "green" },
};

export default Logout;
