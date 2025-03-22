document.addEventListener("DOMContentLoaded", function () {
	const dropdownMenu = document.getElementById("profileDropdown");
	const postTitle = document.getElementById("postTitle");
  const postContent = document.getElementById("postContent");
  const postImage = document.getElementById("postImage");
	const imagePreview = document.getElementById("imagePreview");  
  const helperText = document.getElementById("helperText");
  const submitButton = document.querySelector("button[type='submit']");
	submitButton.disabled = true;

	const headerProfileImage = document.getElementById("headerProfileImage");
	const profileImageUrl = localStorage.getItem("profileImageUrl") || "/data/profile/default_profile.jpg";

	if (headerProfileImage) {
		headerProfileImage.src = profileImageUrl;
	}


	// 가정: 게시글 ID가 URL 파라미터에 존재
	// const urlParams = new URLSearchParams(window.location.search);
	// const postId = urlParams.get("id");

	// if (!postId) {
	// 		alert("게시글 ID가 없습니다.");
	// 		return;
	// }

	try {
			// 기존 게시글 데이터를 가져오기 (API 엔드포인트 예시)
			// const response = await fetch(`/api/posts/${postId}`);
			//if (!response.ok) throw new Error("게시글 데이터를 불러오지 못했습니다.");

			// const postData = await response.json();

			// 제목과 내용 채우기
			postTitle.value = postData.title || "";
			postContent.value = postData.content || "";

			// 이미지가 있을 경우 미리보기 추가
			if (postData.imageUrl) {
					const imgElement = document.createElement("img");
					imgElement.src = postData.imageUrl;
					imgElement.style.maxWidth = "100%";
					imgElement.style.marginTop = "10px";
					imagePreview.appendChild(imgElement);
			}
	} catch (error) {
			console.error("데이터 불러오기 오류:", error);
	}

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
		// TODO : 로그아웃 처리 로직 추가
		alert("로그아웃 되었습니다.");
		window.location.href = "/pages/user/login.html";
	});
});
