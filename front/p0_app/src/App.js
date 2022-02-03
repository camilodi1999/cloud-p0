import { useState, useEffect } from "react";
import authService from "./services/authService";
import NavBar from "./components/navBar";
import Login from "./components/login";
import Events from "./components/events";

function App() {
  const [currentUser, setCurrentUser] = useState({});
  const [boolC, setBoolC] = useState(false);
  function authenticate() {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
    setBoolC(true);
  }
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setBoolC(true);

      //window.location.reload();
      if (authService.verifyToken(user.token)) {
        authService.logout();
        setCurrentUser({});
        setBoolC(false);
      }
    } else {
      setCurrentUser(user);
      setBoolC(false);
    }
  }, []);
  return (
    <div className="App">
      <NavBar usuario={currentUser} />
      <div className="container-fluid">
        {boolC ? (
          <Events user={currentUser} />
        ) : (
          <Login autenticar={authenticate} />
        )}
      </div>
    </div>
  );
}

export default App;
