document.addEventListener("DOMContentLoaded", () => {   
  const profileImage = document.getElementById("profileImage");
  const dropdownMenu = document.getElementById("profileDropdown");
  const previousBtn = document.getElementById("previousBtn");
	
	// 게시글 콘텐츠
  const contentDiv = document.querySelector(".post-content"); 
  
  // 게시글 좋아요
  const likeButton = document.querySelector(".like-btn");
  
  // 댓글 등록
  const commentInputArea = document.querySelector(".comment-input"); 
  const submitButton = document.querySelector(".submit-btn");   
  submitButton.disabled = true;

  const files = ["/data/post/post-image.jpg", "/data/post/post-content.txt"];

  // 삭제 모달
  const postDeleteButtons = document.querySelectorAll(".post .btn-group .post-btn:last-child"); // 게시글 삭제 버튼
  const commentDeleteButtons = document.querySelectorAll(".comment-container .btn-group .comment-btn:last-child"); // 댓글 삭제 버튼
  const postModal = document.getElementById("deletePostModal");
  const commentModal = document.getElementById("deleteCommentModal");
  const confirmPostDelete = document.getElementById("confirmPostDelete");
  const cancelPostDelete = document.getElementById("cancelPostDelete");
  const confirmCommentDelete = document.getElementById("confirmCommentDelete");
  const cancelCommentDelete = document.getElementById("cancelCommentDelete");

  let targetElement = null; // 삭제 대상

  // 게시글 데이터 불러오기
  const fetchPromises = files.map(file => 
      fetch(file)
          .then(response => {
              if (!response.ok) {
                  throw new Error(`${file}을(를) 불러오는데 실패했습니다.`);
              }
              const contentType = response.headers.get("Content-Type");

              if (contentType.includes("image")) {
                  return response.blob(); // 이미지 Blob 변환
              } else {
                  return response.text(); // 텍스트 변환
              }
          })
          .then(data => ({ file, data })) // 파일 이름과 함께 결과 저장
          .catch(error => ({ file, error: error.message })) // 오류 발생 시 저장
  );

  Promise.all(fetchPromises).then(results => {
      results.forEach(({ file, data, error }) => {
          if (error) {
              contentDiv.innerHTML += `<p>${file}을(를) 불러오는 데 실패했습니다.</p>`;
          } else if (data instanceof Blob) {
              const imgElement = document.createElement("img");
              imgElement.src = URL.createObjectURL(data);
              imgElement.style.width = "100%";
              imgElement.style.display = "block";
              contentDiv.appendChild(imgElement);
          } else {
              const textElement = document.createElement("p");
              textElement.textContent = data;
              contentDiv.appendChild(textElement);
          }
      });
  });

  // 좋아요 버튼 인터렉션
  likeButton.addEventListener("click", () => {
    // TODO: 좋아요수 반영 요청
    if (likeButton.classList.toggle("active")) {
        likeCount.innerHTML = `${parseInt(likeCount.textContent) + 1}<br>좋아요수`; // 활성화되면 +1
    } else {
        likeCount.innerHTML = `${parseInt(likeCount.textContent) - 1}<br>좋아요수`; // 비활성화되면 -1
    }
  });

  // 댓글 입력 감지 인터렉션
  commentInputArea.addEventListener("input", () => {
    const text = commentInputArea.value.trim(); 
        if (text.length > 0) {
            submitButton.disabled = false; 
        } else {
            submitButton.disabled = true; 
        }
  });

	// 게시글 삭제 버튼 클릭 시
	postDeleteButtons.forEach(button => {
		button.addEventListener("click", function () {
				targetElement = this.closest(".post");
				postModal.style.display = "flex";
		});
	});

	// 댓글 삭제 버튼 클릭 시
	commentDeleteButtons.forEach(button => {
			button.addEventListener("click", function () {
					targetElement = this.closest(".post-comment");
					commentModal.style.display = "flex";
			});
	});

	// 게시글 삭제 확인
	confirmPostDelete.addEventListener("click", function () {
			if (targetElement) {
					targetElement.remove();
					targetElement = null;
			}
			postModal.style.display = "none";
	});

	// 댓글 삭제 확인
	confirmCommentDelete.addEventListener("click", function () {
			if (targetElement) {
					targetElement.remove();
					targetElement = null;
			}
			commentModal.style.display = "none";
	});

	// 게시글 삭제 취소
	cancelPostDelete.addEventListener("click", function () {
			postModal.style.display = "none";
	});

	// 댓글 삭제 취소
	cancelCommentDelete.addEventListener("click", function () {
			commentModal.style.display = "none";
	});

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

  previousBtn.addEventListener("click", function () {
    window.location.href="/pages/post/posts.html"
  });
});
