import { useState } from "react";
import axios from "axios";

const Registeruser = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    avatar: null, // Store the selected file
  });

  const [message, setMessage] = useState(""); // For success/error messages

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, avatar: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create FormData to send files
    const formDataToSend = new FormData();
    formDataToSend.append("fullName", formData.fullName);
    formDataToSend.append("username", formData.username);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
    if (formData.avatar) {
      formDataToSend.append("avatar", formData.avatar);
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL_BACKEND}/users/register`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    

      setMessage(response.data.message); // Show success message
      setFormData({
        fullName: "",
        username: "",
        email: "",
        password: "",
        avatar: null,
      });
    } catch (error) {
      console.error("Registration error:", error);
      setMessage("Registration failed. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Register</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required style={styles.input} />
        <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required style={styles.input} />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required style={styles.input} />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required style={styles.input} />
        <input type="file" accept="image/*" onChange={handleFileChange} style={styles.fileInput} />
        <button type="submit" style={styles.button}>Register</button>
      </form>

      {/* Show preview of uploaded avatar */}
      {formData.avatar && (
        <div style={styles.preview}>
          <h4>Avatar Preview:</h4>
          <img src={URL.createObjectURL(formData.avatar)} alt="Avatar Preview" style={styles.image} />
        </div>
      )}
    </div>
  );
};

// Styles
const styles = {
  container: { maxWidth: "400px", margin: "auto", textAlign: "center" },
  form: { display: "flex", flexDirection: "column", gap: "10px" },
  input: { padding: "10px", fontSize: "16px", borderRadius: "5px", border: "1px solid #ccc" },
  fileInput: { marginTop: "10px" },
  button: { padding: "10px", fontSize: "18px", borderRadius: "5px", background: "#007BFF", color: "#fff", cursor: "pointer" },
  preview: { marginTop: "20px" },
  image: { width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover" },
};

export default Registeruser;
