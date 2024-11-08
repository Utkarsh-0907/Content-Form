document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("addContentForm");
  const previewButton = document.getElementById("preview-button");
  const saveButton = document.getElementById("save-button");
  const contentTypeSelect = document.getElementById("content-type");
  const contentUrlInput = document.getElementById("content-url");

  contentTypeSelect.addEventListener("change", function () {
    const selectedType = contentTypeSelect.value;

    if (
      selectedType === "video" ||
      selectedType === "pdf" ||
      selectedType === "image" ||
      selectedType === "doc"
    ) {
      contentUrlInput.style.display = "block";
    } else {
      contentUrlInput.style.display = "none";
    }
  });

  previewButton.addEventListener("click", function () {
    const title = document.getElementById("title").value;
    const contentType = document.getElementById("content-type").value;
    const contentUrl = document.getElementById("content-url").value;
    const termsAccepted = document.getElementById("terms").checked;

    if (title === "" || contentType === "" || !termsAccepted) {
      alert("Please fill in all fields and accept the terms.");
      return;
    }

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
      alert(
        `Please enter a valid URL for the selected content type: ${contentType}`
      );
      return;
    }

    alert(
      `Previewing: \nTitle: ${title}\nContent Type: ${contentType}\nURL: ${contentUrl}\nTerms Accepted: ${termsAccepted}`
    );
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const contentType = document.getElementById("content-type").value;
    const contentUrl = document.getElementById("content-url").value;
    const termsAccepted = document.getElementById("terms").checked;

    if (title === "" || contentType === "" || !termsAccepted) {
      alert("Please fill in all fields and accept the terms.");
      return;
    }

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
      alert(
        `Please enter a valid URL for the selected content type: ${contentType}`
      );
      return;
    }

    const contentData = {
      title: title,
      type: contentType,
      url: contentUrl,
      terms: termsAccepted,
    };

    let existingData = JSON.parse(localStorage.getItem("contentData"));

    if (!Array.isArray(existingData)) {
      existingData = [];
    }

    existingData.push(contentData);

    localStorage.setItem("contentData", JSON.stringify(existingData));

    window.location.href = "home.html";

    alert("Content saved successfully!");
    form.reset();
  });
});
