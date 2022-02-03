import { useEffect, useState } from "react";
import authService from "../services/authService";

function NavBar(props) {
  const [user, setUser] = useState({});
  useEffect(() => {
    setUser(props.usuario);
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <h3 style={{ color: "white" }}>ABC</h3>

        <div className="collapse navbar-collapse" id="navbarText">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0"></ul>
          <span className="navbar-text">
            {user ? <h3 style={{ color: "white" }}>{user.email}</h3> : null}
          </span>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
