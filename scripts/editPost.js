document.addEventListener("DOMContentLoaded", function () {
  const postTitle = document.getElementById("postTitle");
  const postContent = document.getElementById("postContent");
  const postImage = document.getElementById("postImage");
	const imagePreview = document.getElementById("imagePreview");  
  const helperText = document.getElementById("helperText");
  const submitButton = document.querySelector("button[type='submit']");

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

  submitButton.disabled = true;
});
