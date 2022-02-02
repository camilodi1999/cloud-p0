import { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import authService from "./services/authService";
import NavBar from "./components/navBar";
import Login from "./components/login";

function App() {
  const [currentUser, setCurrentUser] = useState({});
  useEffect(() => {
    const user = authService.getCurrentUser;
    if (user) {
      setCurrentUser(user);
      if (authService.verifyToken(user.token)) {
        authService.logout();
        setCurrentUser({});
      }
    }
  }, []);
  return (
    <div className="App">
      <NavBar usuario={currentUser} />

      <div className="container-fluid">{currentUser ? null : <Login />}</div>
    </div>
  );
}

export default App;
