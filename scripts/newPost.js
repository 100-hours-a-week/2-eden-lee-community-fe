document.addEventListener("DOMContentLoaded", function () {
  const profileImage = document.getElementById("profileImage");
  const dropdownMenu = document.getElementById("profileDropdown");
  const postTitle = document.getElementById("postTitle");
  const postContent = document.getElementById("postContent");
  const helperText = document.getElementById("helperText");
  const submitButton = document.querySelector("button[type='submit']");
  submitButton.disabled = true;

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

  // 프로필 이미지를 클릭하면 드롭다운 표시/숨김
	profileImage.addEventListener("click", (event) => {
		event.stopPropagation(); 
		const rect = profileImage.getBoundingClientRect();
		
		dropdownMenu.style.left = `${rect.left}px`;
		dropdownMenu.style.top = `${rect.bottom + 5}px`;
		dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";
	});

	// 드롭다운 외부 클릭 시 닫기
	document.addEventListener("click", (event) => {
		if (!dropdownMenu.contains(event.target) && !profileImage.contains(event.target)) {
			dropdownMenu.style.display = "none";
		}
	});

	// 각 메뉴 클릭 이벤트 (기능 추가 가능)
	document.getElementById("editProfile").addEventListener("click", () => {
		window.location.href = "/pages/user/edit-profile.html";
	});

	document.getElementById("changePassword").addEventListener("click", () => {
		window.location.href = "/pages/user/edit-password.html";
	});

	document.getElementById("logout").addEventListener("click", () => {
		// TODO : 로그아웃 처리 로직 추가
		alert("로그아웃 되었습니다.");
		window.location.href = "/pages/user/login.html";
	});
});
