document.addEventListener("DOMContentLoaded", function () {
  const postTitle = document.getElementById("postTitle");
  const postContent = document.getElementById("postContent");
  const helperText = document.getElementById("helperText");
  const submitButton = document.querySelector("button[type='submit']");

  function validateForm() {
      const titleValue = postTitle.value.trim();
      const contentValue = postContent.value.trim();

      if (titleValue.length > 0 && contentValue.length > 0) {
          helperText.style.display = "none";
          submitButton.disabled = false;
      } else {
          helperText.style.display = "block";
          submitButton.disabled = true;
      }
  }

  postTitle.addEventListener("input", validateForm);
  postContent.addEventListener("input", validateForm);

  submitButton.disabled = true;
});
