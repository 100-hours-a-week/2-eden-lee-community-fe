import * as postAPI from "../api/post.js";

document.addEventListener("DOMContentLoaded", function () {
	const SERVER_URL = "http://localhost:8080";
  const DEFAULT_PROFILE_IMAGE = "/uploads/default_profile.gif";

	const dropdownMenu = document.getElementById("profileDropdown");
	const newPostBtn = document.getElementById("newPostBtn");

	const headerProfileImage = document.getElementById("headerProfileImage");
	const rawProfileImageUrl = localStorage.getItem("profileImageUrl");
	console.log(rawProfileImageUrl)

  const profileImageUrl = rawProfileImageUrl
    ? `${SERVER_URL}${rawProfileImageUrl}`
    : DEFAULT_PROFILE_IMAGE; 

	if (headerProfileImage) {
		headerProfileImage.src = profileImageUrl;
	}
	
	async function loadPosts() {
		const postContainer = document.getElementById("postContainer");
	
		try {
			const response = await postAPI.getAllpost(); // 게시글 목록 불러오기
			const posts = response.result.posts;
			
			posts.forEach(post => {
				const {
					post_id,
					title,
					author,
					counts,
					created_at
				} = post;

				const profileImageUrl = post.author.profile_image_url
					? `${SERVER_URL}${post.author.profile_image_url}`
					: DEFAULT_PROFILE_IMAGE;
			
				const article = document.createElement("article");
				article.className = "post-item";
	
				article.innerHTML = `
					<p class="post-title">${title}</p>
					<div class="post-meta">
						<p class="post-like">좋아요 ${counts.likes}</p>
						<p class="post-comment">댓글 ${counts.comments}</p>
						<p class="post-view">조회수 ${counts.views}</p>
						<p class="post-time">${created_at}</p>
					</div>
					<hr class="post-contour"/>
					<div class="post-publisher">
						<img class="profile" src="${profileImageUrl}" alt="작성자 프로필">
						<p class="name">${author.nickname}</p>
					</div>
				`;
	
				// 게시글 클릭 시 상세 페이지 이동
				article.addEventListener("click", () => {
    			postAPI.increasePostViews(post_id);
					window.location.href = `/pages/post/post.html?postId=${post_id}`;
				});
	
				postContainer.appendChild(article);
			});
	
		} catch (error) {
			console.error("게시글 로딩 실패:", error.message);
			postContainer.innerHTML = "<p>게시글을 불러오는 데 실패했습니다.</p>";
		}
	}
	
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

	newPostBtn.addEventListener("click", () => {
		window.location.href = "/pages/post/new-post.html";
	});

	loadPosts();
});
