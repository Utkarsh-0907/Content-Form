document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("addContentForm");
  const previewButton = document.getElementById("preview-button");
  const saveButton = document.getElementById("save-button");
  const contentTypeSelect = document.getElementById("content-type");
  const contentUrlInput = document.getElementById("content-url");

  const titleError = document.getElementById("title-error");
  const contentTypeError = document.getElementById("content-type-error");
  const contentUrlError = document.getElementById("content-url-error");
  const termsError = document.getElementById("terms-error");

  contentTypeSelect.addEventListener("change", function () {
    const selectedType = contentTypeSelect.value;
    contentUrlInput.style.display =
      selectedType === "video" ||
      selectedType === "pdf" ||
      selectedType === "image" ||
      selectedType === "doc"
        ? "block"
        : "none";
    validateContentUrl();
  });

  document.getElementById("title").addEventListener("input", validateTitle);
  contentTypeSelect.addEventListener("input", validateContentType);
  contentUrlInput.addEventListener("input", validateContentUrl);
  document.getElementById("terms").addEventListener("change", validateTerms);

  function validateTitle() {
    if (document.getElementById("title").value.trim() === "") {
      titleError.textContent = "Title is required.";
      titleError.style.display = "block";
      return false;
    } else {
      titleError.style.display = "none";
      return true;
    }
  }

  function validateContentType() {
    if (contentTypeSelect.value === "") {
      contentTypeError.textContent = "Please select a content type.";
      contentTypeError.style.display = "block";
      return false;
    } else {
      contentTypeError.style.display = "none";
      return true;
    }
  }

  function validateContentUrl() {
    const contentType = contentTypeSelect.value;
    const contentUrl = contentUrlInput.value.trim();

    if (
      (contentType === "video" && !contentUrl.endsWith(".mp4")) ||
      (contentType === "pdf" && !contentUrl.endsWith(".pdf")) ||
      (contentType === "image" &&
        !contentUrl.endsWith(".jpg") &&
        !contentUrl.endsWith(".png")) ||
      (contentType === "doc" &&
        !contentUrl.endsWith(".doc") &&
        !contentUrl.endsWith(".docx"))
    ) {
      contentUrlError.textContent = `Please enter a valid URL for ${contentType}.`;
      contentUrlError.style.display = "block";
      return false;
    } else {
      contentUrlError.style.display = "none";
      return true;
    }
  }

  function validateTerms() {
    if (!document.getElementById("terms").checked) {
      termsError.textContent = "You must accept the terms.";
      termsError.style.display = "block";
      return false;
    } else {
      termsError.style.display = "none";
      return true;
    }
  }

  previewButton.addEventListener("click", function () {
    if (
      validateTitle() &
      validateContentType() &
      validateContentUrl() &
      validateTerms()
    ) {
      alert(
        `Previewing: \nTitle: ${
          document.getElementById("title").value
        }\nContent Type: ${contentTypeSelect.value}\nURL: ${
          contentUrlInput.value
        }\nTerms Accepted: ${document.getElementById("terms").checked}`
      );
    }
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (
      validateTitle() &
      validateContentType() &
      validateContentUrl() &
      validateTerms()
    ) {
      const contentData = {
        title: document.getElementById("title").value,
        type: contentTypeSelect.value,
        url: contentUrlInput.value,
        terms: document.getElementById("terms").checked,
      };

      let existingData = JSON.parse(localStorage.getItem("contentData")) || [];
      existingData.push(contentData);
      localStorage.setItem("contentData", JSON.stringify(existingData));

      window.location.href = "home.html";
      alert("Content saved successfully!");
      form.reset();
    }
  });
});
