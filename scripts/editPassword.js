import * as userAPI from "../api/user.js";

document.addEventListener("DOMContentLoaded", function () {
  const userId = localStorage.getItem("userId");
	const dropdownMenu = document.getElementById("profileDropdown");
	
	// 비밀번호 변경
	const passwordInput = document.getElementById("passwordInput");
  const passwordCheckInput = document.getElementById("passwordCheckInput");
	const passwordHelperText = document.getElementById("passwordHelperText");
  const passwordCheckHelperText = document.getElementById("passwordCheckHelperText");
  const editBtn = document.getElementById("editBtn");
	editBtn.disabled = true;

	const headerProfileImage = document.getElementById("headerProfileImage");
	const profileImageUrl = localStorage.getItem("profileImageUrl") || "/data/profile/default_profile.gif";

	if (headerProfileImage) {
		headerProfileImage.src = profileImageUrl;
	}

	function validatePassword(passwordValue) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,20}$/.test(passwordValue);
  }

	function updateEditBtn() {
    const allHelperTexts = [
      passwordHelperText,
      passwordCheckHelperText,
    ];
  
    // 모든 helper text의 opacity가 "0"인지 확인
    const isValid = allHelperTexts.every(helper => helper.style.opacity === "0");
    
    if (isValid) {
      editBtn.style.backgroundColor = "#7F6AEE"
      editBtn.disabled = false;
    } else {
      editBtn.style.backgroundColor = "#ACA0EB"
      editBtn.disabled = true;
    }
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

	passwordInput.addEventListener("blur", function() {
    const passwordValue = passwordInput.value.trim();
    const passwordCheckValue = passwordCheckInput.value.trim();
    passwordHelperText.style.opacity = "1";

    if (passwordValue === "") {
			passwordHelperText.textContent = "*비밀번호를 입력해주세요.";
    } 
    else if (!validatePassword(passwordValue)) {
			passwordHelperText.textContent = "*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";
    } 
    else if (passwordCheckValue === "") {
			passwordHelperText.textContent = "*비밀번호 확인과 다릅니다.";
      passwordCheckHelperText.textContent = "*비밀번호를 한번 더 입력해주세요.";
    } 
    else if (passwordValue !== passwordCheckValue) {
			passwordHelperText.textContent = "*비밀번호 확인과 다릅니다.";
			passwordCheckHelperText.textContent = "*비밀번호와 다릅니다.";
			passwordCheckHelperText.style.opacity = "1";
    } 
    else {
			passwordHelperText.textContent = "*";
			passwordHelperText.style.opacity = "0";
			passwordCheckHelperText.textContent = "*";
			passwordCheckHelperText.style.opacity = "0";
    }
    updateEditBtn();
	});

	passwordCheckInput.addEventListener("blur", function() {
    const passwordValue = passwordInput.value.trim();
    const passwordCheckValue = passwordCheckInput.value.trim();
    passwordCheckHelperText.style.opacity = "1";

    if (passwordCheckValue === "") {
			passwordCheckHelperText.textContent = "*비밀번호를 한번 더 입력해주세요.";
    } 
    else if (passwordValue === "") {

			passwordCheckHelperText.textContent = "*비밀번호와 다릅니다.";
			passwordHelperText.textContent = "*비밀번호를 입력해주세요.";
			passwordHelperText.style.opacity = "1";
    } 
    else if (passwordValue !== passwordCheckValue) {
			passwordHelperText.textContent = "*비밀번호 확인과 다릅니다.";
			passwordHelperText.style.opacity = "1";
			passwordCheckHelperText.textContent = "*비밀번호와 다릅니다.";
    } 
    else {
			passwordHelperText.textContent = "*";
			passwordHelperText.style.opacity = "0";
			passwordCheckHelperText.textContent = "*";
			passwordCheckHelperText.style.opacity = "0";
    }
    updateEditBtn();
	});

	editBtn.addEventListener("click", async function () {
    const password = passwordInput.value.trim();

		try {
			await userAPI.updateUserPassword(userId, password);

			showToast("수정완료");
			editBtn.disabled = true;
		} catch (err) {
			console.error("비밀번호 수정 실패:", err.message);
			alert("비밀번호 수정에 실패했습니다. 다시 시도해주세요.");
		}
  });
});
