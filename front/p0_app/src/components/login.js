import { useEffect, useState } from "react";
import authService from "../services/authService";
import { Routes, Route, Link } from "react-router-dom";

function Login(props) {
  const [action, setAction] = useState("Login");
  const [credentials, setCredentials] = useState({});
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  function loginButton() {
    authService.login(credentials["email"], credentials["password"]);
    props.autenticar();
  }
  function signupButton() {
    authService.signup(credentials["email"], credentials["password"]);
    props.autenticar();
  }
  function clickButton() {
    if (action === "Login") {
      loginButton();
    } else {
      signupButton();
    }
  }

  function clickSecondButton() {
    if (action === "Login") {
      setAction("Signup");
      setCredentials({});
    } else {
      setAction("Login");
      setCredentials({});
    }
  }

  function handleInputChange(event) {
    setCredentials({ ...credentials, [event.target.name]: event.target.value });
  }

  return (
    <div className="container-fluid">
      <div
        className="card text-center"
        style={{
          position: "absolute",
          top: "30%",
          left: "40%",
        }}
      >
        <div className="card-header">{action}</div>
        <div className="card-body">
          <div className="col-auto" style={{ padding: "1rem" }}>
            <label className="form-label">Email address</label>
            <input
              type="email"
              name="email"
              className="form-control"
              id="exampleFormControlInput1"
              onChange={handleInputChange}
              placeholder="name@example.com"
            />
          </div>
          <div className="col-auto" style={{ padding: "1rem" }}>
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              onChange={handleInputChange}
              id="inputPassword2"
              placeholder="Password"
            />
          </div>
          {action !== "Login" ? (
            <div className="col-auto" style={{ padding: "1rem" }}>
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                onChange={handleInputChange}
                id="inputPassword2"
                placeholder="Password"
              />
            </div>
          ) : null}
          <div className="row" style={{ padding: "1rem" }}>
            <div className="col-12">
              <button
                type="button"
                className="btn btn-primary"
                onClick={clickButton}
                style={{ height: "3rem", width: "7rem" }}
              >
                {action}
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={clickSecondButton}
                style={{ height: "3rem", width: "7rem" }}
              >
                {action === "Login" ? "Signup" : "Login"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
