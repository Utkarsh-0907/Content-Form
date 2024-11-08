function login() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  if (!validateEmail(email)) {
    alert("Please enter a valid email.");
    return;
  }

  const storedUser = localStorage.getItem(email);
  if (!storedUser) {
    alert("User does not exist. Please sign up.");
    return;
  }

  const user = JSON.parse(storedUser);
  if (user.password === password) {
    alert("Login successful!");
    localStorage.setItem("currentUser", email);
    window.location.href = "home.html";
  } else {
    alert("Incorrect password. Please try again.");
  }
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

document.getElementById("login-button").addEventListener("click", login);
