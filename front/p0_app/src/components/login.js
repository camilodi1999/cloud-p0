import { useState } from "react";

function Login() {
  const { action, setAction } = useState("Login");
  return (
    <div className="container-fluid">
      <div
        className="card text-center"
        style={{ position: "absolute", top: "30%", left: "35%" }}
      >
        <div className="card-header">Login</div>
        <div className="card-body">
          <h5 className="card-title">Special title treatment</h5>
          <p className="card-text">
            With supporting text below as a natural lead-in to additional
            content.
          </p>
          <a href="#" className="btn btn-primary">
            Go somewhere
          </a>
        </div>
        <div classNames="card-footer text-muted">2 days ago</div>
      </div>
    </div>
  );
}

export default Login;
