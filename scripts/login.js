import * as authAPI from "../api/auth.js";
import { getUserInfo } from "../api/user.js";

document.addEventListener("DOMContentLoaded", function () {
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const helperText = document.getElementById("helperText");
    const loginBtn = document.getElementById("loginBtn");
    const signinBtn = document.getElementById("signinBtn");
    loginBtn.disabled = true;

    function validateEmail(email) {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.value);
    }

    function validatePassword(password) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,20}$/.test(password.value);
    } 

    async function validateUser(email, password) {
        // TODO: 유저 인증 기능 구현
        try {
            const res = await authAPI.login(email, password); 
        
            // 로그인 성공 시 아이디와 토큰 저장
            localStorage.setItem("userId",res.result.user_id);
            localStorage.setItem("accessToken", res.result.access_token);
        
            return true; 
        } catch (err) {
            console.error("로그인 실패:", err.message);
            return false; 
        }
    }

    async function loadUserInfo() {
        // 유저 정보 업로드
        try {
            const userId = localStorage.getItem("userId");
            const res = await getUserInfo(userId);

            const imageUrl = res.result.profile_image_url 
            ? res.result.profile_image_url 
            : "/data/profile/default_profile.gif";

            localStorage.setItem("email",res.result.email);
            localStorage.setItem("nickname",res.result.nickname);
            localStorage.setItem("profileImageUrl", imageUrl);

        } catch (err) {
            console.error("유저정보 조회 실패:", err.message);
            return false; 
        }
    }
    
    function updateHelperText() {
        if (!validateEmail(emailInput)) {
            helperText.textContent = "*올바른 이메일 주소 형식을 입력해주세요. (예:example@example.com)";
        } else if (passwordInput.value.length == 0) {
            helperText.textContent = "*비밀번호를 입력해주세요";
        } else if (!validatePassword(passwordInput)) {
            helperText.textContent = "*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";
        } else {
            helperText.textContent = "";
        }
    }

    function updateLoginBtn() {
        if (helperText.textContent == "") {
            loginBtn.style.backgroundColor = "#7F6AEE";
            loginBtn.disabled = false;
        } else {
            loginBtn.style.backgroundColor = "#ACA0EB";
            loginBtn.disabled = true;
        }
    }

    emailInput.addEventListener("input", function () {
        updateHelperText(); 
        updateLoginBtn();
    });

    passwordInput.addEventListener("input", function () {
        updateHelperText(); 
        updateLoginBtn();
    });

    loginBtn.addEventListener("click", async function () {
        
        if (loginBtn.disabled) {
            // 버튼 비활성화인 경우는 무시
            return
        }

        const isValid = await validateUser(emailInput.value, passwordInput.value); 
        if (isValid) {
            await loadUserInfo();
            window.location.href="/pages/post/posts.html"
        } else {
            helperText.textContent = "*아이디 또는 비밀번호를 확인해주세요";
        }
    });

    signinBtn.addEventListener("click", function () {
        window.location.href="/pages/user/signin.html"
    });
});
 