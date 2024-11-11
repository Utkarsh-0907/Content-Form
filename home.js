document.addEventListener("DOMContentLoaded", function () {
  const contentDiv = document.getElementById("content");
  const selectedFilterHeading = document.getElementById("selected-filter");

  let contentData = JSON.parse(localStorage.getItem("contentData")) || [];

  if (!Array.isArray(contentData)) {
    contentData = [];
  }
  contentData.forEach((content, index) => addContentCard(content, index));

  let debounceTimeout;

  const searchInput = document.getElementById("search-input");
  searchInput.addEventListener("input", () => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      filterContent(currentFilter);
    }, 500);
  });

  function addContentCard(content, index) {
    if (!content.terms) return;

    const card = document.createElement("div");
    card.classList.add("content-card");

    const editContainer = document.createElement("div");
    editContainer.classList.add("edit-icon-container");
    editContainer.innerHTML = `
      <svg class="edit-icon" viewBox="0 0 24 24" width="24" height="24">
        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
      </svg>
    `;
    editContainer.style.display = "none";

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

    card.addEventListener("mouseenter", () => {
      editContainer.style.display = "block";
    });

    card.addEventListener("mouseleave", () => {
      editContainer.style.display = "none";
    });
    editContainer.addEventListener("click", (e) => {
      e.stopPropagation();
      openEditForm(content, index);
    });

    card.addEventListener("click", () => {
      window.location.href = content.url;
    });

    card.appendChild(editContainer);
    card.appendChild(image);
    card.appendChild(title);
    contentDiv.appendChild(card);
  }

  function openEditForm(content, index) {
    const modal = document.createElement("div");
    modal.classList.add("edit-modal");

    modal.innerHTML = `
      <div class="edit-modal-content">
        <h2>Edit Content</h2>
        <form id="editContentForm">
          <input type="text" id="edit-title" value="${
            content.title
          }" required />
          
          <select id="edit-content-type" required>
            <option value="video" ${
              content.type === "video" ? "selected" : ""
            }>Video</option>
            <option value="pdf" ${
              content.type === "pdf" ? "selected" : ""
            }>PDF</option>
            <option value="image" ${
              content.type === "image" ? "selected" : ""
            }>Image</option>
            <option value="doc" ${
              content.type === "doc" ? "selected" : ""
            }>Document</option>
          </select>
          
          <input type="url" id="edit-content-url" value="${
            content.url
          }" required />
          
          <label>
            <input type="checkbox" id="edit-terms" ${
              content.terms ? "checked" : ""
            } required /> 
            Visibility
          </label>
          
          <div class="edit-modal-buttons">
            <button type="submit">Save Changes</button>
            <button type="button" class="cancel-button">Cancel</button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(modal);

    const editForm = modal.querySelector("#editContentForm");
    editForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const updatedContent = {
        title: document.getElementById("edit-title").value,
        type: document.getElementById("edit-content-type").value,
        url: document.getElementById("edit-content-url").value,
        terms: document.getElementById("edit-terms").checked,
      };

      const urlValidation = validateContentUrl(
        updatedContent.url,
        updatedContent.type
      );
      if (!urlValidation.isValid) {
        alert(urlValidation.message);
        return;
      }

      contentData[index] = updatedContent;
      localStorage.setItem("contentData", JSON.stringify(contentData));

      filterContent(currentFilter);

      modal.remove();
    });

    const cancelButton = modal.querySelector(".cancel-button");
    cancelButton.addEventListener("click", () => {
      modal.remove();
    });

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }

  function validateContentUrl(url, type) {
    const validations = {
      video: [".mp4"],
      pdf: [".pdf"],
      image: [".jpg", ".png"],
      doc: [".doc", ".docx"],
    };

    const extensions = validations[type];
    const isValid = extensions.some((ext) => url.toLowerCase().endsWith(ext));

    return {
      isValid,
      message: isValid
        ? ""
        : `Please enter a valid URL for ${type} (must end with ${extensions.join(
            " or "
          )})`,
    };
  }

  function addNewContent(newContent) {
    contentData.push(newContent);
    localStorage.setItem("contentData", JSON.stringify(contentData));
    filterContent(currentFilter);
  }

  let currentFilter = "all";

  function filterContent(type) {
    const searchTerm = searchInput.value.toLowerCase();
    currentFilter = type;
    contentDiv.innerHTML = "";

    const filterHeadingText = {
      all: "All Content",
      video: "Videos",
      pdf: "PDFs",
      image: "Images",
      doc: "Documents",
    };
    selectedFilterHeading.textContent = filterHeadingText[type];

    contentData
      .filter(
        (content) =>
          (type === "all" || content.type === type) &&
          content.title.toLowerCase().includes(searchTerm)
      )
      .forEach((content, index) => addContentCard(content, index));
    if (searchTerm.length > 0) {
      return;
    }
    toggleSidebar();
  }

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
    .addEventListener("click", () => filterContent("doc"));

  document.getElementById("list-view").addEventListener("click", () => {
    contentDiv.classList.add("list-view");
    contentDiv.classList.remove("grid-view");
  });

  document.getElementById("grid-view").addEventListener("click", () => {
    contentDiv.classList.add("grid-view");
    contentDiv.classList.remove("list-view");
  });
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
``;
