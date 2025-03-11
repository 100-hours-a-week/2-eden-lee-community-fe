document.addEventListener("DOMContentLoaded", function () {
  const profileImageUrl = "/data/profile/키티프로필.jpg"; // 기존 프로필 이미지 경로
	const profileImage = document.getElementById("profileImage");
	const dropdownMenu = document.getElementById("profileDropdown");
	const uploadContainer = document.getElementById("uploadContainer");
	const deleteAccountBtn = document.getElementById("deleteAccountBtn");
	const editBtn = document.getElementById("editBtn");
	editBtn.disabled = true;

	// 데이터 입력
  const fileInput = document.getElementById("profileImageInput");
	const nicknameInput = document.getElementById("nicknameInput");
	const nicknameHelperText = document.getElementById("nicknameHelperText");
	
	// 회원탈퇴 모달
	const deleteAccountModal = document.getElementById("deleteAccountModal");
  const confirmAccountDelete = document.getElementById("confirmAccountDelete");
  const cancelAccountDelete = document.getElementById("cancelAccountDelete");
  

	function checkNicknameDuplication(nicknameValue) {
    // TODO : 닉네임 중복 체크
    return true
  }

	function showToast(message) {
    const toast = document.getElementById("toast");
		toast.innerText = message;
    toast.classList.add("show"); // 토스트 메시지 표시

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
	}
	
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

	nicknameInput.addEventListener("blur", function() {
    const nicknameValue = nicknameInput.value;
    nicknameHelperText.style.opacity = "1";
		editBtn.disabled = true;

    if (nicknameValue === "") {
      nicknameHelperText.textContent = "*닉네임을 입력해주세요.";  
    } else if (/\s/.test(nicknameValue)) {
      nicknameHelperText.textContent = "*띄어쓰기를 없애주세요.";
    } else if (nicknameValue.length > 10) {
      nicknameHelperText.textContent = "*닉네임은 최대 10자까지 작성 가능합니다.";
    } else if (!checkNicknameDuplication(nicknameValue)) {
      nicknameHelperText.textContent = "*중복된 닉네임 입니다.";
    } else {
      nicknameHelperText.style.opacity = "0";
			editBtn.disabled = false;
    }
  });

	editBtn.addEventListener("click", (event) => {
		// TODO: 닉네임 수정 요청
		showToast("수정완료");
	});

	deleteAccountBtn.addEventListener("click", (event) => {
		deleteAccountModal.style.display = "flex";
	});

	confirmAccountDelete.addEventListener("click", function () {
		// TODO: 회원탈퇴 요청 
    window.location.href = "/pages/user/login.html";
	});	

	cancelAccountDelete.addEventListener("click", function () {
		deleteAccountModal.style.display = "none";
	});
});
