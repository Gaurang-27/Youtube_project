import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../Redux/UserSlice";

const LoginUser = () => {

  const dispatch = useDispatch()


  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState(""); // Success/error message

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL_BACKEND}/users/login`, formData, {
        withCredentials: true,
      });
      

      console.log(response)
      dispatch(setUser(response.data.data.user));
      // Store the JWT token in localStorage
      localStorage.setItem("refreshToken", response.data.data.refreshToken);
      localStorage.setItem("accessToken",response.data.data.accessToken)

      setMessage("Login successful!");
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Invalid email or password.");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Login</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Login</button>
      </form>
    </div>
  );
};

// Styles
const styles = {
  container: { maxWidth: "400px", margin: "auto", textAlign: "center" },
  form: { display: "flex", flexDirection: "column", gap: "10px" },
  input: { padding: "10px", fontSize: "16px", borderRadius: "5px", border: "1px solid #ccc" },
  button: { padding: "10px", fontSize: "18px", borderRadius: "5px", background: "#007BFF", color: "#fff", cursor: "pointer" },
};

export default LoginUser;
