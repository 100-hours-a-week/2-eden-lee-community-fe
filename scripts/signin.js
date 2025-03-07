
// TODO
// 각 항목 helper text 동적으로 보여주기

document.addEventListener("DOMContentLoaded", function () {
  const uploadContainer = document.getElementById("uploadContainer");
  const fileInput = document.getElementById("profileImage");
  const previousBtn = document.getElementById("previousBtn");
  const loginBtn = document.getElementById("loginBtn");
  const signinBtn = document.getElementById("signinBtn");
    
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

  previousBtn.addEventListener("click", function () {
    console.log("herere")
    window.location.href="/pages/user/login.html"
  });
  
  loginBtn.addEventListener("click", function () {
    console.log("herere")
    window.location.href="/pages/user/login.html"
  });

});
