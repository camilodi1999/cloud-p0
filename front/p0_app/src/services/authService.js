const url_back = "http://localhost:5000";

const signup = (email, password) => {
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  let body = { email, password };
  fetch(url_back + "/signup", {
    headers: myHeaders,
    method: "POST",
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .then((json) => {
      localStorage.setItem("user", JSON.stringify(json));
      return json;
    });
};

const login = (email, password) => {
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  let body = { email, password };
  fetch(url_back + "/login", {
    headers: myHeaders,
    method: "POST",
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .then((json) => {
      localStorage.setItem("user", JSON.stringify(json));
      return json;
    });
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const logout = () => {
  localStorage.removeItem("user");
};

const verifyToken = (token) => {
  try {
    const jwt = JSON.parse(atob(token.split(".")[1]));
    if (jwt.exp * 1000 < Date.now()) {
      return false;
    }
  } catch (e) {
    console.log(e);
  }
};

const authService = {
  signup,
  login,
  logout,
  getCurrentUser,
  verifyToken,
};

export default authService;
