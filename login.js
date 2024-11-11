function login() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  const emailErrorDiv = document.getElementById("email-error");
  const passwordErrorDiv = document.getElementById("password-error");

  emailErrorDiv.textContent = "";
  passwordErrorDiv.textContent = "";

  if (!validateEmail(email)) {
    emailErrorDiv.textContent = "Please enter a valid email.";
    return;
  }

  const storedUser = localStorage.getItem(email);
  if (!storedUser) {
    emailErrorDiv.textContent = "User does not exist. Please sign up.";
    return;
  }

  const user = JSON.parse(storedUser);
  if (user.password === password) {
    localStorage.setItem("currentUser", email);
    window.location.href = "home.html";
  } else {
    passwordErrorDiv.textContent = "Incorrect password. Please try again.";
  }
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

document.getElementById("login-email").addEventListener("input", function () {
  const emailErrorDiv = document.getElementById("email-error");
  if (validateEmail(this.value)) {
    emailErrorDiv.textContent = ""; 
  } else {
    emailErrorDiv.textContent = "Please enter a valid email.";
  }
});

document
  .getElementById("login-password")
  .addEventListener("input", function () {
    const passwordErrorDiv = document.getElementById("password-error");
    if (this.value.trim().length > 0) {
      passwordErrorDiv.textContent = ""; 
    } else {
      passwordErrorDiv.textContent = "Password cannot be empty.";
    }
  });

document.getElementById("login-button").addEventListener("click", login);
