
// TODO
// 2. 각 항목 helper text 동적으로 보여주기
// 3. < 버튼과 로그인 하러가기 버튼 클릭 시 login.html로 이동    

document.addEventListener("DOMContentLoaded", function () {
  const uploadContainer = document.getElementById("uploadContainer");
  const fileInput = document.getElementById("profileImage");

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
