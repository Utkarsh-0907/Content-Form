document.addEventListener("DOMContentLoaded", function () {
  const contentDiv = document.getElementById("content");
  const selectedFilterHeading = document.getElementById("selected-filter");
  const paginationContainer = document.createElement("div");
  paginationContainer.classList.add("pagination");
  contentDiv.parentNode.insertBefore(
    paginationContainer,
    contentDiv.nextSibling
  );

  let contentData = JSON.parse(localStorage.getItem("contentData")) || [];
  
  const itemsPerPage = 10;

  if (!Array.isArray(contentData)) {
    contentData = [];
  }
  function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
      page: parseInt(params.get("page")) || 1,
      filter: params.get("filter") || "all",
      search: params.get("search") || "",
    };
  }

  function updateUrl(page, filter, search) {
    const url = new URL(window.location);
    url.searchParams.set("page", page);
    url.searchParams.set("filter", filter);
    if (search) {
      url.searchParams.set("search", search);
    } else {
      url.searchParams.delete("search");
    }
    window.history.pushState({}, "", url);
  }

  const urlParams = getUrlParams();
  let currentPage = urlParams.page;
  let currentFilter = urlParams.filter;

  const searchInput = document.getElementById("search-input");
  searchInput.value = urlParams.search;

  let debounceTimeout;

  searchInput.addEventListener("input", () => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      currentPage = 1; 
      const searchTerm = searchInput.value;
      updateUrl(currentPage, currentFilter, searchTerm);
      filterContent(currentFilter);
    }, 500);
  });

  window.addEventListener("popstate", () => {
    const params = getUrlParams();
    currentPage = params.page;
    currentFilter = params.filter;
    searchInput.value = params.search;
    filterContent(currentFilter, true);
  });

  function renderPagination(filteredItems) {
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    paginationContainer.innerHTML = "";

    if (totalPages <= 1) {
      return;
    }

    const prevButton = document.createElement("button");
    prevButton.textContent = "Previous";
    prevButton.classList.add("pagination-btn");
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        updateUrl(currentPage, currentFilter, searchInput.value);
        filterContent(currentFilter);
      }
    });
    paginationContainer.appendChild(prevButton);

    const createPageButton = (pageNum) => {
      const pageButton = document.createElement("button");
      pageButton.textContent = pageNum;
      pageButton.classList.add("pagination-btn");
      if (pageNum === currentPage) {
        pageButton.classList.add("active");
      }
      pageButton.addEventListener("click", () => {
        currentPage = pageNum;
        updateUrl(currentPage, currentFilter, searchInput.value);
        filterContent(currentFilter);
      });
      return pageButton;
    };

    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      paginationContainer.appendChild(createPageButton(1));
      if (startPage > 2) {
        const ellipsis = document.createElement("span");
        ellipsis.textContent = "...";
        ellipsis.classList.add("pagination-ellipsis");
        paginationContainer.appendChild(ellipsis);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      paginationContainer.appendChild(createPageButton(i));
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        const ellipsis = document.createElement("span");
        ellipsis.textContent = "...";
        ellipsis.classList.add("pagination-ellipsis");
        paginationContainer.appendChild(ellipsis);
      }
      paginationContainer.appendChild(createPageButton(totalPages));
    }

    const nextButton = document.createElement("button");
    nextButton.textContent = "Next";
    nextButton.classList.add("pagination-btn");
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener("click", () => {
      if (currentPage < totalPages) {
        currentPage++;
        updateUrl(currentPage, currentFilter, searchInput.value);
        filterContent(currentFilter);
      }
    });
    paginationContainer.appendChild(nextButton);
  }

  function addContentCard(content, index) {
    if (!content.terms) {
      contentDiv.classList.add("hidden");
    } else {
      contentDiv.classList.remove("hidden");
    }
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
            }/> 
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


  function filterContent(type, skipPushState = false) {
    const searchTerm = searchInput.value.toLowerCase();
    currentFilter = type;
    contentDiv.innerHTML = "";

    const filterHeadingText = {
      all: "All Content",
      video: "Videos",
      pdf: "PDFs",
      image: "Images",
      doc: "Documents",
      hidden: "Hidden Content",
    };
    selectedFilterHeading.textContent = filterHeadingText[type];

    const filteredItems = contentData.filter((content) => {
      if (type === "all" || content.type === type) {
        return (
          content.terms === true &&
          content.title.toLowerCase().includes(searchTerm)
        );
      }

      if (type === "hidden") {
        return (
          content.terms === false &&
          content.title.toLowerCase().includes(searchTerm)
        );
      }

      return false;
    });

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    if (currentPage > totalPages) {
      currentPage = totalPages || 1;
      if (!skipPushState) {
        updateUrl(currentPage, currentFilter, searchInput.value);
      }
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = filteredItems.slice(startIndex, endIndex);

    paginatedItems.forEach((content, index) => {
      addContentCard(content, startIndex + index);
    });

    renderPagination(filteredItems);

    if (searchTerm.length > 0) {
      return;
    }
    sidebar.classList.remove("open");
    content.style.marginLeft = "0";
  }

  document.getElementById("all-button").addEventListener("click", () => {
    currentPage = 1;
    updateUrl(currentPage, "all", searchInput.value);
    filterContent("all");
  });
  document.getElementById("video-button").addEventListener("click", () => {
    currentPage = 1;
    updateUrl(currentPage, "video", searchInput.value);
    filterContent("video");
  });
  document.getElementById("pdf-button").addEventListener("click", () => {
    currentPage = 1;
    updateUrl(currentPage, "pdf", searchInput.value);
    filterContent("pdf");
  });
  document.getElementById("image-button").addEventListener("click", () => {
    currentPage = 1;
    updateUrl(currentPage, "image", searchInput.value);
    filterContent("image");
  });
  document.getElementById("docs-button").addEventListener("click", () => {
    currentPage = 1;
    updateUrl(currentPage, "doc", searchInput.value);
    filterContent("doc");
  });
  document.getElementById("hidden").addEventListener("click", () => {
    currentPage = 1;
    updateUrl(currentPage, "hidden", searchInput.value);
    filterContent("hidden");
  });

  filterContent(currentFilter);
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
