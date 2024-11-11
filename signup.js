function signUp() {
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  const confirmPassword = document.getElementById(
    "signup-confirmPassword"
  ).value;

  document.getElementById("email-error").textContent = "";
  document.getElementById("password-error").textContent = "";
  document.getElementById("confirm-password-error").textContent = "";

  if (!validateEmail(email)) {
    document.getElementById("email-error").textContent =
      "Please enter a valid email.";
    return;
  }

  if (!validatePassword(password)) {
    document.getElementById("password-error").textContent =
      "Password must be at least 6 characters, with at least one uppercase letter, one lowercase letter, and one number.";
    return;
  }

  if (confirmPassword !== password) {
    document.getElementById("confirm-password-error").textContent =
      "Passwords do not match.";
    return;
  }

  if (localStorage.getItem(email)) {
    document.getElementById("email-error").textContent =
      "User already exists. Please log in.";
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
  if (
    value.length < 6 ||
    !/[A-Z]/.test(value) ||
    !/[a-z]/.test(value) ||
    !/[0-9]/.test(value)
  ) {
    return false;
  }
  return true;
}

document.getElementById("signup-email").addEventListener("input", function () {
  const emailErrorDiv = document.getElementById("email-error");
  if (validateEmail(this.value)) {
    emailErrorDiv.textContent = "";
  } else {
    emailErrorDiv.textContent = "Please enter a valid email.";
  }
});

document
  .getElementById("signup-password")
  .addEventListener("input", function () {
    const passwordErrorDiv = document.getElementById("password-error");
    if (validatePassword(this.value)) {
      passwordErrorDiv.textContent = "";
    } else {
      passwordErrorDiv.textContent =
        "Password must be at least 6 characters, with at least one uppercase letter, one lowercase letter, and one number.";
    }
  });

document
  .getElementById("signup-confirmPassword")
  .addEventListener("input", function () {
    const confirmPasswordErrorDiv = document.getElementById(
      "confirm-password-error"
    );
    const password = document.getElementById("signup-password").value;
    if (this.value === password) {
      confirmPasswordErrorDiv.textContent = "";
    } else {
      confirmPasswordErrorDiv.textContent = "Passwords do not match.";
    }
  });

document.getElementById("signup-button").addEventListener("click", signUp);
