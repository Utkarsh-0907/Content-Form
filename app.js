document.addEventListener("DOMContentLoaded", function () {
  const contentDiv = document.getElementById("content");
  const searchInput = document.getElementById("search-input");
  const selectedFilterHeading = document.getElementById("selected-filter");

  let contentData = JSON.parse(localStorage.getItem("contentData")) || [];
  let currentFilter = "all";

  searchInput.addEventListener("input", () => {
    filterContent(currentFilter);
  });

  document.getElementById("list-view").addEventListener("click", () => {
    contentDiv.classList.remove("grid-view");
    contentDiv.classList.add("list-view");
  });

  document.getElementById("grid-view").addEventListener("click", () => {
    contentDiv.classList.remove("list-view");
    contentDiv.classList.add("grid-view");
  });

  function filterContent(type) {
    currentFilter = type;
    selectedFilterHeading.textContent =
      type === "all"
        ? "All Content"
        : `${type.charAt(0).toUpperCase() + type.slice(1)} Content`;

    const searchTerm = searchInput.value.toLowerCase();
    contentDiv.innerHTML = ""; // Clear content before re-rendering

    const filteredContent = contentData.filter((content) => {
      // Only show the card if:
      // - the content's terms is not false
      // - the content's type matches the filter (or is 'all')
      // - the title matches the search term
      return (
        content.terms !== false && // Check if terms is not false
        (type === "all" || content.type === type) &&
        (!searchTerm || content.title.toLowerCase().includes(searchTerm))
      );
    });

    // Only add content that matches the filter and search term
    filteredContent.forEach((content) => {
      addContentCard(content);
    });
  }

  function addContentCard(content) {
    const card = document.createElement("div");
    card.classList.add("content-card");

    const image = document.createElement("img");
    image.classList.add("content-card-image");
    image.src = getContentIcon(content.type);

    const title = document.createElement("h3");
    title.classList.add("content-card-title");
    title.textContent = content.title;

    card.addEventListener("click", () => {
      window.location.href = content.url;
    });

    card.appendChild(image);
    card.appendChild(title);
    contentDiv.appendChild(card);
  }

  function getContentIcon(type) {
    switch (type) {
      case "video":
        return "icons/video.png";
      case "pdf":
        return "icons/pdf.png";
      case "image":
        return "icons/image.png";
      case "doc":
        return "icons/Docs.png";
      default:
        return "icons/default-icon.png";
    }
  }

  filterContent(currentFilter);
});
