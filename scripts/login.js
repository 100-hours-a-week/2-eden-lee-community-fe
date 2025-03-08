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

    function validateUser(email, password) {
        // TODO: 유저 인증 기능 구현
        return true
    }
    
    function updateHelperText() {
        if (!validateEmail(emailInput)) {
            helperText.textContent = "*올바른 이메일 주소 형식을 입력해주세요. (예:example@example.com)";
        } else if (passwordInput.value.length == 0) {
            helperText.textContent = "*비밀번호를 입력해주세요";
        } else if (!validatePassword(passwordInput)) {
            helperText.textContent = "*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";
        } else if (!validateUser(emailInput, passwordInput)) {
            helperText.textContent = "*아이디 또는 비밀번호를 확인해주세요";            
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

    loginBtn.addEventListener("click", function () {
        if (loginBtn.disabled) {
            // 버튼 비활성화인 경우는 무시
            return
        }
        if (validateUser(emailInput, passwordInput)) {
            window.location.href="/pages/post/posts.html"
        } else {
            alert("회원 인증에 실패했습니다. 이메일과 비밀번호를 확인해주세요.");
        }
    });

    signinBtn.addEventListener("click", function () {
        window.location.href="/pages/user/signin.html"
    });
});
 