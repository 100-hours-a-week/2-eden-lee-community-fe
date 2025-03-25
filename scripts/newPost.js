import { createPost } from "../api/post.js";

document.addEventListener("DOMContentLoaded", function () {
	const SERVER_URL = "http://localhost:8080";
  const DEFAULT_PROFILE_IMAGE = "/data/profile/default_profile.gif";
	const userId = Number(localStorage.getItem("userId"));

  const previousBtn = document.getElementById("previousBtn");
  const dropdownMenu = document.getElementById("profileDropdown");
  const postTitle = document.getElementById("postTitle");
  const postContent = document.getElementById("postContent");
  const helperText = document.getElementById("helperText");
	const postForm = document.getElementById("postForm");
  const submitButton = document.querySelector("button[type='submit']");
	const postImage = document.getElementById("postImage"); 
  
  submitButton.disabled = true;

	const headerProfileImage = document.getElementById("headerProfileImage");
	
	const rawProfileImageUrl = localStorage.getItem("profileImageUrl");
  const profileImageUrl = rawProfileImageUrl
    ? `${SERVER_URL}${rawProfileImageUrl}`
    : DEFAULT_PROFILE_IMAGE; 

  if (headerProfileImage) {
    headerProfileImage.src = profileImageUrl;
  }


  function validateForm() {
      const titleValue = postTitle.value.trim();
      const contentValue = postContent.value.trim();
	
      if (titleValue.length > 0 && contentValue.length > 0) {
          helperText.style.opacity = "0";
          submitButton.disabled = false;
      } else {
          helperText.style.opacity = "1";
          submitButton.disabled = true;
      }
  }

  postTitle.addEventListener("input", validateForm);
  postContent.addEventListener("input", validateForm);

  // 프로필 이미지를 클릭하면 드롭다운 표시/숨김
	headerProfileImage.addEventListener("click", (event) => {
		event.stopPropagation(); 
		const rect = headerProfileImage.getBoundingClientRect();
		
		dropdownMenu.style.left = `${rect.left}px`;
		dropdownMenu.style.top = `${rect.bottom + 5}px`;
		dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";
	});

	// 드롭다운 외부 클릭 시 닫기
	document.addEventListener("click", (event) => {
		if (!dropdownMenu.contains(event.target) && !headerProfileImage.contains(event.target)) {
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
		localStorage.clear();
		alert("로그아웃 되었습니다.");
		window.location.href = "/pages/user/login.html";
	});
	
	previousBtn.addEventListener("click", function () {
    window.location.href="/pages/post/posts.html"
  });

	postForm.addEventListener("submit", async function (event) {
		event.preventDefault();

		const file = postImage.files[0] ?? null;

		const formData = new FormData();
		formData.append("userId", userId);
		formData.append("title", postTitle.value.trim());
		formData.append("text", postContent.value.trim());
		formData.append("postImage", file);
	
		try {
				await createPost(formData);
				alert("게시글이 성공적으로 등록되었습니다!");
				window.location.href = "/pages/post/posts.html";
		} catch (error) {
				alert("게시글 등록 중 오류가 발생했습니다.");
		}
	});
});
