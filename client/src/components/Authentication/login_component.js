import React, { useState } from "react";
import bcrypt from "bcryptjs"; // Use bcryptjs for hashing
import "./login.css"
import Button from 'react-bootstrap/Button';

// A static salt is used here ONLY to be compatible with the backend's direct hash comparison.
// In a real-world scenario, the backend should handle password comparison with bcrypt.compare.
const STATIC_SALT = "$2a$10$abcdefghijklmnopqrstuv"; // Example static salt

export default function Login() {
  // --- State Management with useState Hooks ---
  const [loginMethod, setLoginMethod] = useState("mobile"); // 'mobile' or 'id'
  const [mobilenum, setMobilenum] = useState("");
  const [farmerid, setFarmerid] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // --- Event Handler ---
  const handleSubmit = (e) => {
    e.preventDefault();

    // 1. Hash the password using bcrypt and the static salt
    const hashedPassword = bcrypt.hashSync(password, STATIC_SALT);
    
    // 2. Prepare the data payload based on the selected login method
    const payload = {
      Password: hashedPassword,
    };

    if (loginMethod === "mobile") {
      payload.Mobilenum = mobilenum;
    } else {
      payload.Farmerid = farmerid;
    }
    
    console.log("Submitting payload:", payload);

    // 3. Send the request to the server
    fetch("http://localhost:8000/farmer/farmerlogin", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.Farmerid) {
          // On successful login, store user data and redirect
          console.log("Login successful:", data);
          localStorage.setItem("user", JSON.stringify(data));
          window.location.href = "./Myaccount";
        } else {
          // On failure, display the error message from the server
          console.error("Login failed:", data.error);
          setLoginError(data.error);
        }
      })
      .catch(error => {
          console.error("Network or server error:", error);
          setLoginError("Could not connect to the server.");
      });
  };

  return (
    <div className="auth-wrapper_Login">
      <div className="auth-inner_Login">
        <form className="form" id="loginform" onSubmit={handleSubmit}>
          <h2 id="loginh2">Sign In</h2>
          <div className="radio_div">
            <label>
              <input
                className="radiobut_div"
                type="radio"
                name="loginMethod"
                value="mobile"
                checked={loginMethod === "mobile"}
                onChange={(e) => setLoginMethod(e.target.value)}
              />
              Mobile Number
            </label>
            <label>
              <input
                className="radiobut_div"
                type="radio"
                name="loginMethod"
                value="id"
                checked={loginMethod === "id"}
                onChange={(e) => setLoginMethod(e.target.value)}
              />
              Unique Id
            </label>
          </div>

          {loginMethod === "mobile" && (
            <div className="mb-3">
              <label>Mobile Number</label>
              <input
                type="text"
                className="form-control"
                id="logindata"
                placeholder="Enter Your Mobile number"
                onChange={(e) => setMobilenum(e.target.value)}
              />
            </div>
          )}

          {loginMethod === "id" && (
            <div className="mb-3">
              <label>Unique Farmer Id</label>
              <input
                type="text"
                className="form-control"
                id="logindata"
                placeholder="Enter Your Unique Id"
                onChange={(e) => setFarmerid(e.target.value)}
              />
            </div>
          )}

          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              id="logindata"
              placeholder="Enter Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            {loginError && <p style={{ color: "red", marginTop: "3px" }}>{loginError}</p>}
          </div>

          <div className="d-grid">
            <Button variant="success" type="submit" className="btn btn-primary" id="singinbtn">
              Submit
            </Button>
          </div>
          <p className="forgot-password text-right">
            <a id="login_pageflow" href="/sign-up">Sign Up</a> <br />
            <a id="login_pageflow" href="/adminlogin">Admin Login</a>
          </p>
        </form>

        <div id="rightside">
          <img id="rightimg" src="./imgs/login_pic.jpg" alt="loginimg" />
        </div>
      </div>
    </div>
  );
}