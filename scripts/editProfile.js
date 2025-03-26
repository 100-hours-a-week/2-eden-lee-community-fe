import * as userAPI from "../api/user.js";

document.addEventListener("DOMContentLoaded", async function () {
	const SERVER_URL = "http://localhost:8080";
  const DEFAULT_PROFILE_IMAGE = "/data/profile/default_profile.gif";

	const isFileChange = false

	const userId = localStorage.getItem("userId");
	const emailElement = document.getElementById("email");
  const myEmail = localStorage.getItem("email");
	const myNickname = localStorage.getItem("nickname");

	if (myEmail) {
    emailElement.textContent = myEmail;
  } else {
    emailElement.textContent = "이메일 정보 없음";
  }
	
	// 데이터 입력
  const fileInput = document.getElementById("profileImageInput");
	const nicknameInput = document.getElementById("nicknameInput");
	const nicknameHelperText = document.getElementById("nicknameHelperText");
	
	if (myNickname) {
		nicknameInput.value = myNickname;
		nicknameHelperText.textContent = "*";
    nicknameHelperText.style.opacity = "0";		
	}
	
	const dropdownMenu = document.getElementById("profileDropdown");
	const uploadContainer = document.getElementById("uploadContainer");
	const deleteAccountBtn = document.getElementById("deleteAccountBtn");
	const editBtn = document.getElementById("editBtn");
	editBtn.disabled = true;

	// 회원탈퇴 모달
	const deleteAccountModal = document.getElementById("deleteAccountModal");
  const confirmAccountDelete = document.getElementById("confirmAccountDelete");
  const cancelAccountDelete = document.getElementById("cancelAccountDelete");

	const headerProfileImage = document.getElementById("headerProfileImage");
	
	const rawProfileImageUrl = localStorage.getItem("profileImageUrl");
  const profileImageUrl = rawProfileImageUrl
    ? `${SERVER_URL}${rawProfileImageUrl}`
    : DEFAULT_PROFILE_IMAGE; 

  if (headerProfileImage) {
    headerProfileImage.src = profileImageUrl;
  }

	async function checkNicknameDuplication(nicknameValue) {
		try {
			const res = await userAPI.checkNicknameDuplicate(nicknameValue); 
	
			return res.result.duplicate; 
		} catch (err) {
			console.error("닉네임 중복 체크 실패:", err.message);
			return false; 
		}
  }

	function showToast(message) {
    const toast = document.getElementById("toast");
		toast.innerText = message;
    toast.classList.add("show"); // 토스트 메시지 표시

    setTimeout(() => {
        toast.classList.remove("show");
				location.reload();
    }, 2000);
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

		editBtn.disabled = false;
  });

	nicknameInput.addEventListener("blur", async function() {
		const nicknameValue = nicknameInput.value;
    nicknameHelperText.style.opacity = "1";
		editBtn.disabled = true;

    if (nicknameValue === "") {
      nicknameHelperText.textContent = "*닉네임을 입력해주세요.";  
    } else if (/\s/.test(nicknameValue)) {
      nicknameHelperText.textContent = "*띄어쓰기를 없애주세요.";
    } else if (nicknameValue.length > 10) {
      nicknameHelperText.textContent = "*닉네임은 최대 10자까지 작성 가능합니다.";
    } else if (nicknameValue === myNickname) {
      nicknameHelperText.textContent = "*";
			nicknameHelperText.style.opacity = "0";
			if (!isFileChange) {
				editBtn.disabled = false;
			}
		} else {
      const isDuplicate = await checkNicknameDuplication(nicknameValue);

      if (isDuplicate) {
        nicknameHelperText.textContent = "*중복된 닉네임 입니다.";
      } else {
        nicknameHelperText.textContent = "*";
        nicknameHelperText.style.opacity = "0";
				editBtn.disabled = false;
      }
    } 
  });

	editBtn.addEventListener("click", async (event) => {
		const file = fileInput.files[0] ?? null;

		const formData = new FormData();
		formData.append("nickname", nicknameInput.value);
		
		if (file) {
			formData.append("profileImage", file);
		}

		try {
			const res = await userAPI.updateUserProfile(userId, formData);

			const imageUrl = res.result.profile_image_url 
				? res.result.profile_image_url 
				: "/data/profile/default_profile.gif";

			// 로컬스토리지 업데이트
			localStorage.setItem("nickname", nicknameInput.value);
			localStorage.setItem("profileImageUrl", imageUrl);

			showToast("수정완료");
			
		} catch (err) {
			console.error("회원정보 수정 실패:", err.message);
			alert("회원정보 수정에 실패했습니다. 다시 시도해주세요.");
		}
	});

	deleteAccountBtn.addEventListener("click", (event) => {
		deleteAccountModal.style.display = "flex";
	});

	confirmAccountDelete.addEventListener("click", async function () {
		try {
			await userAPI.deleteUser(userId);
			
			localStorage.clear(); 
			alert("회원 탈퇴가 완료되었습니다.");
			window.location.href = "/pages/user/login.html";
		} catch (err) {
			console.error("회원탈퇴 실패:", err.message);
			alert("회원 탈퇴에 실패했습니다. 다시 시도해주세요.");
		}
    window.location.href = "/pages/user/login.html";
	});	

	cancelAccountDelete.addEventListener("click", function () {
		deleteAccountModal.style.display = "none";
	});
});
