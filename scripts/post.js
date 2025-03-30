import * as postAPI from "../api/post.js"
import * as commentAPI from "../api/comment.js"

document.addEventListener("DOMContentLoaded", async () => { 
  const SERVER_URL = "http://localhost:8080";
  const DEFAULT_PROFILE_IMAGE = "/uploads/default_profile.gif";

  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("postId");
  const userId = Number(localStorage.getItem("userId"));

  if (!postId) {
    alert("게시글 ID가 없습니다.");
    return;
  }
  
  const dropdownMenu = document.getElementById("profileDropdown");
  const previousBtn = document.getElementById("previousBtn");
	
  // 게시글 좋아요
  const likeButton = document.querySelector(".like-btn");
  
  // 댓글 등록
  const commentInputArea = document.querySelector(".comment-input"); 
  const submitButton = document.querySelector(".submit-btn");   
  submitButton.disabled = true;

  // 삭제 모달
  const commentContainer = document.querySelector(".comment-container");
  const postDeleteButtons = document.querySelectorAll(".post .btn-group .post-btn:last-child"); // 게시글 삭제 버튼
  const postModal = document.getElementById("deletePostModal");
  const commentModal = document.getElementById("deleteCommentModal");
  const confirmPostDelete = document.getElementById("confirmPostDelete");
  const cancelPostDelete = document.getElementById("cancelPostDelete");
  const confirmCommentDelete = document.getElementById("confirmCommentDelete");
  const cancelCommentDelete = document.getElementById("cancelCommentDelete");

  const headerProfileImage = document.getElementById("headerProfileImage");

  const rawProfileImageUrl = localStorage.getItem("profileImageUrl");
  const profileImageUrl = rawProfileImageUrl
    ? `${SERVER_URL}${rawProfileImageUrl}`
    : DEFAULT_PROFILE_IMAGE; 

  if (headerProfileImage) {
    headerProfileImage.src = profileImageUrl;
  }

  // 게시글 데이터 불러오기
  try {
    const res = await postAPI.getPost(postId);
    const post = res.result.post;

    const isMyPost = userId === post.author.user_id;

    const profileImage = post.author.profile_image_url
      ? `${SERVER_URL}${post.author.profile_image_url}`
      : DEFAULT_PROFILE_IMAGE;
  
    // 게시글 관련 요소 채우기
    document.querySelector(".post-title .title").textContent = post.title;
    document.querySelector(".post-publisher .name").textContent = post.author.nickname;
    document.querySelector(".post-publisher .profile").src = profileImage;
    document.querySelector(".post-publisher .post-time").textContent = post.created_at;
    
    
    const postContentEl = document.querySelector(".post-content");
    // 이미지가 있는 경우 먼저 이미지 삽입
    postContentEl.innerHTML = "";
    if (post.contents.image_url) {
      const image = document.createElement("img");
      image.src = `${SERVER_URL}${post.contents.image_url}`;
      image.alt = "게시글 이미지";
      image.style.maxWidth = "100%";
      image.style.marginBottom = "1rem";
      postContentEl.appendChild(image);
    }

    // 텍스트 내용 삽입
    const textPara = document.createElement("p");
    textPara.textContent = post.contents.text;
    postContentEl.appendChild(textPara);

    document.getElementById("likeCount").innerHTML = `${post.counts.likes}<br>좋아요수`;
    document.getElementById("viewCount").innerHTML = `${post.counts.views}<br>조회수`;
    document.getElementById("commentCount").innerHTML = `${post.counts.comments}<br>댓글`;

    if (post.likes_status === "ACTIVE") {
      likeButton.classList.add("active");
    } else {
      likeButton.classList.remove("active");
    }

    const postBtnGroup = document.querySelector(".post-publisher .btn-group");
    if (!isMyPost && postBtnGroup) {
      postBtnGroup.style.display = "none";
    }

    // 댓글 렌더링
    const commentContainer = document.querySelector(".comment-container");
    
    post.comments.forEach(comment => {
      const isMine = comment.author.user_id === userId;
      const profileImageUrl = comment.author.profile_image_url
        ? `${SERVER_URL}${comment.author.profile_image_url}`
        : DEFAULT_PROFILE_IMAGE;

    
      const commentHTML = `
        <div class="post-comment" data-comment-id="${comment.comment_id}">
          <div class="comment">
            <div class="comment-publisher">
              <img class="profile" src="${profileImageUrl}" alt="댓글 작성자">
              <p class="name">${comment.author.nickname}</p>
              <p class="post-time">${comment.created_at}</p>
            </div>
            <p class="comment-content">${comment.contents}</p>
          </div>
          ${
            isMine
              ? `
            <div class="btn-group">
              <button class="comment-btn">수정</button>
              <button class="comment-btn">삭제</button>
            </div>
            `
              : ""
          }
        </div>
      `;    
      commentContainer.insertAdjacentHTML("beforeend", commentHTML);
    });

  } catch (err) {
    console.error("게시글 상세 로딩 실패:", err.message);
    alert("게시글을 불러오는 데 실패했습니다.");
  }


  // 좋아요 버튼 인터렉션
  likeButton.addEventListener("click", async () => {
    try {
      const response = await postAPI.likePost(postId, userId);
      const { likes_count, likes_status } = response.result;
  
      // 좋아요 상태 반영
      likeCount.innerHTML = `${likes_count}<br>좋아요수`;
  
      if (likes_status === "ACTIVE") {
        likeButton.classList.add("active");
      } else {
        likeButton.classList.remove("active");
      }
  
    } catch (err) {
      console.error("좋아요 요청 실패:", err.message);
      alert("좋아요 요청에 실패했습니다.");
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

  // 댓글 등록
  submitButton.addEventListener("click", async () => {
    const content = commentInputArea.value.trim();
  
    try {
      await commentAPI.createComment(userId, postId, content);
      alert("댓글이 등록되었습니다.");
      window.location.reload(); // 혹은 댓글만 다시 불러오기
    } catch (err) {
      console.error("댓글 등록 실패:", err.message);
      alert("댓글 등록에 실패했습니다.");
    }
  });

  let targetElement = null; // 삭제 대상

	// 게시글 삭제 버튼 클릭 시
	postDeleteButtons.forEach(button => {
		button.addEventListener("click", function () {
				targetElement = this.closest(".post");
				postModal.style.display = "flex";
		});
	});

  // 댓글 삭제 버튼 클릭 시 (이벤트 위임)
  commentContainer.addEventListener("click", (event) => {
    const deleteBtn = event.target;
    const isDeleteButton = deleteBtn.classList.contains("comment-btn") && deleteBtn.textContent.includes("삭제");
  
    if (isDeleteButton) {
      targetElement = deleteBtn.closest(".post-comment");
      commentModal.style.display = "flex";
    }
  });

	// 게시글 삭제 확인
	confirmPostDelete.addEventListener("click", async function () {
    try {
      await postAPI.deletePost(postId);
      alert("게시글이 삭제되었습니다.");
      window.location.href = "/pages/post/posts.html"; // 목록 페이지로 이동
    } catch (err) {
      console.error("게시글 삭제 실패:", err.message);
      alert("게시글 삭제에 실패했습니다. 다시 시도해주세요.");
    }
			
	});

	// 댓글 삭제 확인
	confirmCommentDelete.addEventListener("click", async function () {
    const selectedCommentId = targetElement?.dataset.commentId;

    try {
      await commentAPI.deleteComment(selectedCommentId);
      alert("댓글이 삭제되었습니다.");
      window.location.reload();
    } catch (err) {
      console.error("댓글 삭제 실패:", err.message);
      alert("댓글 삭제에 실패했습니다. 다시 시도해주세요.");
    }
	});

	// 게시글 삭제 취소
	cancelPostDelete.addEventListener("click", function () {
			postModal.style.display = "none";
      targetElement = null;      
	});

	// 댓글 삭제 취소
	cancelCommentDelete.addEventListener("click", function () {
			commentModal.style.display = "none";
      targetElement = null;
	});

  //게시글 수정
  const postUpdateButton = document.getElementById("post-update");

  postUpdateButton.addEventListener("click", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("postId");

    if (!postId) {
      alert("게시글 ID가 없습니다.");
      return;
    }

    // 수정 페이지로 이동
    window.location.href = `/pages/post/edit-post.html?postId=${postId}`;
  });


  // 댓글 수정
  commentContainer.addEventListener("click", async (event) => {
    const editBtn = event.target.closest(".comment-btn")?.textContent === "수정"
      ? event.target
      : null;
    const saveBtn = event.target.closest(".comment-btn.save");
    const cancelBtn = event.target.closest(".comment-btn.cancel");
    
    if (editBtn) {
      const commentEl = editBtn.closest(".post-comment");
      const commentId = commentEl.dataset.commentId;
      const contentEl = commentEl.querySelector(".comment-content");
      const btnGroupEl = commentEl.querySelector(".btn-group");
  
      const originalText = contentEl.textContent;
  
      // 1. 댓글 내용 textarea로 변경
      contentEl.outerHTML = `<textarea class="comment-edit-input">${originalText}</textarea>`;
  
      // 2. 버튼 그룹을 저장/취소로 변경
      btnGroupEl.innerHTML = `
        <button class="comment-btn save" data-id="${commentId}">저장</button>
        <button class="comment-btn cancel">취소</button>
      `;
    } else if (saveBtn) {
      const commentId = saveBtn.dataset.id;
      const commentEl = saveBtn.closest(".post-comment");
      const textarea = commentEl.querySelector(".comment-edit-input");
      const newContent = textarea.value.trim();
  
      if (!newContent) {
        alert("내용을 입력해주세요.");
        return;
      }
  
      try {
        await commentAPI.updateComment(commentId, newContent);
        alert("댓글이 수정되었습니다.");
        window.location.reload();
      } catch (err) {
        console.error("댓글 수정 실패:", err.message);
        alert("댓글 수정에 실패했습니다.");
      }
    } else if (cancelBtn) {
      // 취소 시 새로고침 또는 복구
      window.location.reload();
    }

  });
  

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
});
