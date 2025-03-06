document.addEventListener("DOMContentLoaded", function () {
  const profileImageUrl = "/data/profile/키티프로필.jpg"; // 기존 프로필 이미지 경로
  const uploadContainer = document.getElementById("uploadContainer");
  const fileInput = document.getElementById("profileImageInput");
	
	// 기존 프로필 이미지 불러오기
	if (profileImageUrl) {
		uploadContainer.style.backgroundImage = `url('${profileImageUrl}')`;
		uploadContainer.style.backgroundSize = "cover";
		uploadContainer.style.backgroundPosition = "center";

	}

  // 파일 선택 시 미리보기 업데이트
  fileInput.addEventListener("change", function (event) {
		const file = event.target.files[0];

		if (file) {
			const reader = new FileReader();
			reader.onload = function (e) {
				uploadContainer.style.backgroundImage = `url('${e.target.result}')`;
				uploadContainer.style.backgroundSize = "cover";
				uploadContainer.style.backgroundPosition = "center";
			};
			reader.readAsDataURL(file);
		}
  });
});
