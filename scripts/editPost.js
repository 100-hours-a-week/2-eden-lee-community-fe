import * as postAPI from "../api/post.js"

document.addEventListener("DOMContentLoaded", async function () {
	const SERVER_URL = "http://localhost:8080";
  const DEFAULT_PROFILE_IMAGE = "/data/profile/default_profile.gif";

	const dropdownMenu = document.getElementById("profileDropdown");
	const postTitle = document.getElementById("postTitle");
  const postContent = document.getElementById("postContent");
	const fileLabel = document.getElementById("fileLabel");
  const postImage = document.getElementById("postImage"); 
  const helperText = document.getElementById("helperText");
  const submitButton = document.querySelector("button[type='submit']");
	submitButton.disabled = true;

	const headerProfileImage = document.getElementById("headerProfileImage");
	
	const rawProfileImageUrl = localStorage.getItem("profileImageUrl");
  const profileImageUrl = rawProfileImageUrl
    ? `${SERVER_URL}${rawProfileImageUrl}`
    : DEFAULT_PROFILE_IMAGE; 

  if (headerProfileImage) {
    headerProfileImage.src = profileImageUrl;
  }

	const urlParams = new URLSearchParams(window.location.search);
	const postId = urlParams.get("postId");

	if (!postId) {
			alert("게시글 ID가 없습니다.");
			return;
	}

	try {
			// 기존 게시글 데이터를 가져오기 (API 엔드포인트 예시)
			const res = await postAPI.getPost(postId)
			const postData = res.result.post;

			// 제목과 내용 채우기
			postTitle.value = postData.title || "";
			postContent.value = postData.contents.text || "";
			const imageFileNameSpan = document.getElementById("fileLabel");

			// 이미지가 있을 경우
			if (postData.contents.image_url) {
				const imageUrl = postData.contents.image_url;
				const fileName = imageUrl.split("/").pop(); // 파일명만 추출
			
				imageFileNameSpan.textContent = `${fileName}`;
			} else {
				imageFileNameSpan.textContent = "파일 선택 없음";
			}

			validateForm();
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

	// 이미지 변경시 이름도 바뀜
	postImage.addEventListener("change", () => {
		const file = postImage.files[0];
		fileLabel.textContent = file ? `${file.name}` : "파일이 선택되지 않았습니다.";
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

	// 수정 요청
	submitButton.addEventListener("click", async function (e) {
		e.preventDefault();
	
		const file = postImage.files[0] ?? null;

		const formData = new FormData();
		formData.append("title", postTitle.value.trim());
		formData.append("text", postContent.value.trim());
		
		if (file) {
			formData.append("postImage", file);
		}
	
		try {
			await postAPI.updatePost(postId, formData);
			alert("게시글이 수정되었습니다.");
			window.location.href = `/pages/post/post.html?postId=${postId}`;
		} catch (err) {
			console.error("게시글 수정 실패:", err.message);
			alert("게시글 수정에 실패했습니다. 다시 시도해주세요.");
		}
	});
	

	// 이전버튼
	previousBtn.addEventListener("click", function () {
    window.location.href=`/pages/post/post.html?postId=${postId}`;
  });
});
