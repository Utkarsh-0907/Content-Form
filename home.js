function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("open");
  const content = document.getElementById("content");
  if (sidebar.classList.contains("open")) {
    content.style.marginLeft = "200px";
  } else {
    content.style.marginLeft = "0";
  }
}

function logout() {
  localStorage.removeItem("email");
  localStorage.removeItem("password");
  window.location.href = "login.html";
}

document.getElementById("list-view").addEventListener("click", () => {
  const content = document.getElementById("content");
  content.classList.add("list-view");
  content.classList.remove("grid-view");
});

document.getElementById("grid-view").addEventListener("click", () => {
  const content = document.getElementById("content");
  content.classList.add("grid-view");
  content.classList.remove("list-view");
});

document
  .getElementById("all-button")
  .addEventListener("click", () => filterContent("all"));
document
  .getElementById("video-button")
  .addEventListener("click", () => filterContent("video"));
document
  .getElementById("pdf-button")
  .addEventListener("click", () => filterContent("pdf"));
document
  .getElementById("image-button")
  .addEventListener("click", () => filterContent("image"));
document
  .getElementById("docs-button")
  .addEventListener("click", () => filterContent("docs"));

function filterContent(type) {
  const content = document.getElementById("content");
  console.log(`Filtering content by type: ${type}`);
}
