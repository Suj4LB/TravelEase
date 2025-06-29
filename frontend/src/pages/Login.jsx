import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import "./AuthForm.css";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
  const newErrors = {};
  if (!formData.username) newErrors.username = "Username is required";
  if (!formData.password) newErrors.password = "Password is required";
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
}


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const loginData = {
        username: formData.username,
        password: formData.password,
      }
      try{
        const response = await fetch(`${import.meta.env.VITE_LOGIN_API_URL}/auth/login`,{
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData)
        });
        if(response.ok){
          const data = await response.json();
          console.log("Token or response data: ", data);
          navigate("/flightsearch");
        }else{
          const error = await response.json();
          alert("Login Failed"+ (error.message || "Invalid credentails"));
        }
      }catch(err){
        console.log("Error during login: ", err);
        alert("An error occured Please try again ");
      }
    }
  };

return (
  <div className="auth-container">
    <div className="auth-box">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="string"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={errors.username ? "error" : ""}
          />
          {errors.username && <span className="error-message">{errors.username}</span>}
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? "error" : ""}
          />
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>

        <button type="submit" className="submit-btn">
          Login
        </button>
      </form>

      <p className="toggle-mode">
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  </div>
);
};

export default Login;
