function signUp() {
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  const confirmpassword = document.getElementById(
    "signup-confirmPassword"
  ).value;

  if (!validateEmail(email) || password.length < 6) {
    alert(
      "Please enter a valid email and a password with at least 6 characters."
    );
    return;
  }
  if (!validatePassword(password)) {
    alert("please enter strong password");
    return;
  }
  if (confirmpassword !== password) {
    alert("Password does not match");
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

function validatePassword(value) {
  if (value.length === 0) return false;
  if (value.length < 6) return false;
  if (!/[A-Z]/.test(value)) return false;
  if (!/[a-z]/.test(value)) return false;
  if (!/[0-9]/.test(value)) return false;
  return true;
}

document.getElementById("signup-button").addEventListener("click", signUp);
