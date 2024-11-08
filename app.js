function checkLogin() {
  const currentUser = localStorage.getItem("currentUser");
  if (!currentUser) {
    alert("Please log in first.");
    window.location.href = "login.html";
  }
}

function logout() {
  localStorage.removeItem("currentUser");
  alert("Logged out successfully!");
  window.location.href = "login.html";
}
