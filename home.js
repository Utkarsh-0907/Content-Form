document.addEventListener("DOMContentLoaded", function () {
  const contentDiv = document.getElementById("content");

  let contentData = JSON.parse(localStorage.getItem("contentData"));

  if (!Array.isArray(contentData)) {
    contentData = [];
  }

  contentData.forEach((content) => addContentCard(content));

  function addContentCard(content) {
    if (!content.terms) return;

    const card = document.createElement("div");
    card.classList.add("content-card");

    const image = document.createElement("img");
    image.classList.add("content-card-image");

    switch (content.type) {
      case "video":
        image.src = "icons/video.png";
        break;
      case "pdf":
        image.src = "icons/pdf.png";
        break;
      case "image":
        image.src = "icons/image.png";
        break;
      case "doc":
        image.src = "icons/Docs.png";
        break;
      default:
        image.src = "icons/default-icon.png";
    }

    const title = document.createElement("h3");
    title.classList.add("content-card-title");
    title.textContent = content.title;

    card.addEventListener("click", function () {
      window.location.href = content.url;
    });

    card.appendChild(image);
    card.appendChild(title);

    contentDiv.appendChild(card);
  }

  function addNewContent(newContent) {
    contentData.push(newContent);

    localStorage.setItem("contentData", JSON.stringify(contentData));

    addContentCard(newContent);
  }

});

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
