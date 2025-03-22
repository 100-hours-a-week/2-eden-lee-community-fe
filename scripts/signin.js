import * as authAPI from "../api/user.js";

// 각 항목 helper text 동적으로 보여주기
document.addEventListener("DOMContentLoaded", function () {
  const uploadContainer = document.getElementById("uploadContainer");
  const previousBtn = document.getElementById("previousBtn");
  const loginBtn = document.getElementById("loginBtn");
  const signinBtn = document.getElementById("signinBtn");
  signinBtn.disabled = true;

  // 데이터 입력
  const fileInput = document.getElementById("profileImage");
  const emailInput = document.getElementById("emailInput");
  const passwordInput = document.getElementById("passwordInput");
  const passwordCheckInput = document.getElementById("passwordCheckInput");
  const nicknameInput = document.getElementById("nicknameInput");
  
  // helper text 선언
  const profileHelperText = document.getElementById("profileHelperText");
  const emailHelperText = document.getElementById("emailHelperText");
  const passwordHelperText = document.getElementById("passwordHelperText");
  const passwordCheckHelperText = document.getElementById("passwordCheckHelperText");
  const nicknameHelperText = document.getElementById("nicknameHelperText");

  function validateEmail(emailValue) {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailValue);
  }

  async function checkEmailDuplication(emailValue) {
    // TODO : 이메일 중복 체크
    try {
      const res = await authAPI.checkEmailDuplicate(emailValue); 
  
      return res.result.duplicate; 
    } catch (err) {
      console.error("이메일 중복 체크 실패:", err.message);
      return false; 
    }
  }

  function validatePassword(passwordValue) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,20}$/.test(passwordValue);
  }
  
  async function checkNicknameDuplication(nicknameValue) {
    // TODO : 닉네임 중복 체크
    try {
      const res = await authAPI.checkNicknameDuplicate(nicknameValue); 
  
      return res.result.duplicate; 
    } catch (err) {
      console.error("닉네임 중복 체크 실패:", err.message);
      return false; 
    }
  }

  function updateSigninBtn() {
    const allHelperTexts = [
      profileHelperText,
      emailHelperText,
      passwordHelperText,
      passwordCheckHelperText,
      nicknameHelperText
    ];
  
    // 모든 helper text의 opacity가 "0"인지 확인
    const isValid = allHelperTexts.every(helper => helper.style.opacity === "0");
    
    if (isValid) {
      signinBtn.style.backgroundColor = "#7F6AEE"
      signinBtn.disabled = false;
    } else {
      signinBtn.style.backgroundColor = "#ACA0EB"
      signinBtn.disabled = true;
    }
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
        uploadContainer.classList.add("uploaded");
      };
      reader.readAsDataURL(file);
      profileHelperText.textContent = "*";
      profileHelperText.style.opacity = "0";
    } else {
      uploadContainer.style.backgroundImage = "none"; // 배경 이미지 제거
      uploadContainer.classList.remove("uploaded"); // + 아이콘 다시 표시
      profileHelperText.textContent = "*프로필 사진을 추가해주세요.";
      profileHelperText.style.opacity = "1";
    }

    updateSigninBtn();
  });

  emailInput.addEventListener("blur", async function() {
    const emailValue = emailInput.value.trim();
    emailHelperText.style.opacity = "1";

    if (emailValue === "") {
      emailHelperText.textContent = "*이메일을 입력해주세요.";  
    } else if (!validateEmail(emailValue)) {
      emailHelperText.textContent = "*올바른 이메일 주소 형식을 입력해주세요. (예:example@example.com)";  
    } else {
      const isDuplicate = await checkEmailDuplication(emailValue);

      if (isDuplicate) {
        emailHelperText.textContent = "*중복된 이메일 입니다.";
      } else {
        emailHelperText.textContent = "*";
        emailHelperText.style.opacity = "0";
      }
    } 
    updateSigninBtn();
  });

  passwordInput.addEventListener("blur", function() {
    const passwordValue = passwordInput.value.trim();
    passwordHelperText.style.opacity = "1";

    if (passwordValue === "") {
      passwordHelperText.textContent = "*비밀번호를 입력해주세요.";  
    } else if (!validatePassword(passwordValue)) {
      passwordHelperText.textContent = "*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";  
    } else {
      passwordHelperText.textContent = "*";
      passwordHelperText.style.opacity = "0";
    }

    updateSigninBtn();
  });

  passwordCheckInput.addEventListener("blur", function() {
    const passwordValue = passwordInput.value.trim();
    const passwordCheckValue = passwordCheckInput.value.trim();
    passwordCheckHelperText.style.opacity = "1";

    if (passwordValue === "") {
      passwordCheckHelperText.textContent = "*비밀번호를 한번 더 입력해주세요.";  
    } else if (passwordValue != passwordCheckValue) {
      passwordCheckHelperText.textContent = "*비밀번호가 다릅니다.";  
    } else {
      passwordCheckHelperText.textContent = "*";
      passwordCheckHelperText.style.opacity = "0";
    }

    updateSigninBtn();
  });

  nicknameInput.addEventListener("blur", async function() {
    const nicknameValue = nicknameInput.value;
    nicknameHelperText.style.opacity = "1";

    if (nicknameValue === "") {
      nicknameHelperText.textContent = "*닉네임을 입력해주세요.";  
    } else if (/\s/.test(nicknameValue)) {
      nicknameHelperText.textContent = "*띄어쓰기를 없애주세요.";
    } else if (nicknameValue.length > 10) {
      nicknameHelperText.textContent = "*닉네임은 최대 10자까지 작성 가능합니다.";
    } else {
      const isDuplicate = await checkNicknameDuplication(nicknameValue);

      if (isDuplicate) {
        nicknameHelperText.textContent = "*중복된 닉네임 입니다.";
      } else {
        nicknameHelperText.textContent = "*";
        nicknameHelperText.style.opacity = "0";
      }
    }
    updateSigninBtn();
  });

  previousBtn.addEventListener("click", function () {
    window.location.href="/pages/user/login.html"
  });
  
  loginBtn.addEventListener("click", function () {
    window.location.href="/pages/user/login.html"
  });

  signinBtn.addEventListener("click", async function () {
    // TODO: 회원정보 저장 로직 - 이미지 저장을 어떻게 하는 것이 좋을까..
    console.log(fileInput.value);
    try {
      const res = await authAPI.signup(emailInput.value, passwordInput.value, nicknameInput.value, null); 
      
      alert("회원가입이 완료되었습니다.");
      window.location.href="/pages/user/login.html";
    } catch (err) {
      console.error("회원가입 실패: ", err.message);
      alert("회원가입이 실패하였습니다.");
    }
  });
});
