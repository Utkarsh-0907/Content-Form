
function signUp() {
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  if (!validateEmail(email) || password.length < 6) {
    alert(
      "Please enter a valid email and a password with at least 6 characters."
    );
    return;
  }

  if (localStorage.getItem(email)) {
    alert("User already exists. Please login.");
    return;
  }

  localStorage.setItem(email, JSON.stringify({ email, password }));
  alert("Signup successful! You can now log in.");
  window.location.href = "login.html";
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

document.getElementById("signup-button").addEventListener("click", signUp);
