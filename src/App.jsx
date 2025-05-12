
import React, { useState, useEffect } from "react";
import { GoogleLogin } from '@react-oauth/google';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './App.css'

const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID"; // Replace with your actual Google Client ID
const natureImages = [
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e',
  'https://images.unsplash.com/photo-1472214103451-9374bd1c798e',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e'
];

function App() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [page, setPage] = useState("login");
  const [userData, setUserData] = useState(null);
  const [loginInput, setLoginInput] = useState({ username: "", password: "", showPassword: false });
  const [registerInput, setRegisterInput] = useState({ username: "", password: "", email: "", showPassword: false });
  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    if (userData && loginInput.username === userData.username && loginInput.password === userData.password) {
      setMessage("✅ Login successful!");
      setIsLoggedIn(true);
    } else {
      setMessage("❌ Invalid username or password.");
    }
  };

  const handleRegister = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!registerInput.username || !registerInput.password || !registerInput.email) {
      setMessage("❗ Please fill all fields.");
      return;
    }

    if (!emailRegex.test(registerInput.email)) {
      setMessage("❗ Please enter a valid email address.");
      return;
    }

    setUserData({
      username: registerInput.username,
      password: registerInput.password,
      email: registerInput.email,
    });
    setRegisterInput({ username: "", password: "", email: "", showPassword: false });
    setMessage("✅ Registration successful! Please login.");
    setPage("login");
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % natureImages.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ ...styles.container, backgroundImage: `url(${natureImages[currentImageIndex]})` }}>
      <div style={styles.card}>
        {isLoggedIn ? (
          <div style={styles.welcomePage}>
            <h1 style={styles.welcomeTitle}>Welcome {userData?.username || "User"}!</h1>
            <p style={styles.welcomeText}>You have successfully logged in.</p>
            <button style={styles.button} onClick={() => {setIsLoggedIn(false); setLoginInput({ username: "", password: "", showPassword: false })}}>
              Logout
            </button>
          </div>
        ) : page === "login" ? (
          <>
            <h2 style={styles.title}>Login</h2>
            <input
              type="text"
              placeholder="Username"
              style={styles.input}
              value={loginInput.username}
              onChange={(e) => setLoginInput({ ...loginInput, username: e.target.value })}
            />
            <div style={styles.passwordContainer}>
              <input
                type={loginInput.showPassword ? "text" : "password"}
                placeholder="Password"
                style={styles.passwordInput}
                value={loginInput.password}
                onChange={(e) => setLoginInput({ ...loginInput, password: e.target.value })}
              />
              <button 
                type="button"
                onClick={() => setLoginInput({ ...loginInput, showPassword: !loginInput.showPassword })}
                style={styles.showPasswordButton}
              >
                <i className={loginInput.showPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
              </button>
            </div>
            <button style={styles.button} onClick={handleLogin}>Login</button>
            <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
              <div style={styles.googleSignIn}>
                <GoogleLogin
                  onSuccess={credentialResponse => {
                    console.log(credentialResponse);
                    setMessage("✅ Google Sign-in successful!");
                    setIsLoggedIn(true);
                  }}
                  onError={() => {
                    setMessage("❌ Google Sign-in failed");
                  }}
                />
              </div>
            </GoogleOAuthProvider>
            <p style={styles.text}>
              Don't have an account?{" "}
              <span style={styles.link} onClick={() => { setPage("register"); setMessage(""); }}>
                Register
              </span>
            </p>
          </>
        ) : (
          <>
            <h2 style={styles.title}>Register</h2>
            <input
              type="text"
              placeholder="Username"
              style={styles.input}
              value={registerInput.username}
              onChange={(e) => setRegisterInput({ ...registerInput, username: e.target.value })}
            />
            <div style={styles.passwordContainer}>
              <input
                type={registerInput.showPassword ? "text" : "password"}
                placeholder="Password"
                style={styles.passwordInput}
                value={registerInput.password}
                onChange={(e) => setRegisterInput({ ...registerInput, password: e.target.value })}
              />
              <button 
                type="button"
                onClick={() => setRegisterInput({ ...registerInput, showPassword: !registerInput.showPassword })}
                style={styles.showPasswordButton}
              >
                <i className={registerInput.showPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
              </button>
            </div>
            <input
              type="email"
              placeholder="Email ID"
              style={styles.input}
              value={registerInput.email}
              onChange={(e) => setRegisterInput({ ...registerInput, email: e.target.value })}
            />
            <button style={styles.button} onClick={handleRegister}>Submit</button>
            <p style={styles.text}>
              Already have an account?{" "}
              <span style={styles.link} onClick={() => { setPage("login"); setMessage(""); }}>
                Login
              </span>
            </p>
          </>
        )}
        <p style={styles.message}>{message}</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "'Poppins', sans-serif",
    transition: "all 2s ease-in-out",
  },
  card: {
    background: "rgba(255, 255, 255, 0.1)",
    padding: "40px",
    borderRadius: "15px",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
    backdropFilter: "blur(10px)",
    width: "320px",
    textAlign: "center",
  },
  title: {
    marginBottom: "20px",
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333",
  },
  input: {
    width: "calc(100% - 40px)",
    padding: "12px 15px",
    margin: "10px 0",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
    fontSize: "14px",
    transition: "0.3s",
    color: "#000000",
    background: "transparent",
  },
  passwordContainer: {
    position: 'relative',
    width: '100%',
    marginBottom: '10px',
  },
  passwordInput: {
    width: 'calc(100% - 40px)',
    padding: '12px 15px',
    margin: '10px 0',
    borderRadius: '8px 0 0 8px',
    border: '1px solid #ccc',
    borderRight: 'none',
    outline: 'none',
    fontSize: '14px',
    transition: '0.3s',
    color: '#000000',
    background: "transparent",
  },
  showPasswordButton: {
    width: '30px',
    height: '40px',
    position: 'absolute',
    right: '0',
    top: '10px',
    background: 'transparent',
    border: '1px solid #ccc',
    borderLeft: 'none',
    borderRadius: '0 8px 8px 0',
    color: 'red',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "transparent",
    color: "#fff",
    border: "2px solid #fff",
    borderRadius: "8px",
    fontSize: "16px",
    color: "#000",marginTop: "10px",
    transition: "all 0.3s",
  },
  text: {
    fontSize: "14px",
    marginTop: "15px",
    color: "#000000",
  },
  link: {
    color: "#ff0000",
    cursor: "pointer",
    textDecoration: "underline",
    fontWeight: "bold",
  },
  message: {
    marginTop: "15px",
    color: "#e74c3c",
    fontWeight: "bold",
    fontSize: "14px",
  },
  welcomePage: {
    textAlign: "center",
  },
  welcomeTitle: {
    fontSize: "28px",
    color: "#ffffff",
    marginBottom: "20px",
  },
  welcomeText: {
    fontSize: "18px",
    color: "#ffffff",
    marginBottom: "30px",
  },
  googleSignIn: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "center",
  },
};

export default App;
