function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (username === "admin" && password === "admin123") {
    // localStorage.setItem("loggedIn", true);
    window.location.href = "dashboard.html";
  } else {
    alert("Invalid Credentials");
  }
};