document.addEventListener("DOMContentLoaded", () => {
  const contentDiv = document.querySelector(".post-content");
  const likeButton = document.querySelector(".like-btn");
  const commentInputArea = document.querySelector(".comment-input");
  const submitButton = document.querySelector(".submit-btn");

  submitButton.disabled = true;

  // 파일 리스트 (이미지가 먼저, 텍스트가 나중)
  const files = ["data/post-image.jpg", "data/post-content.txt"];

  // 게시글 데이터 불러오기
  const fetchPromises = files.map(file => 
      fetch(file)
          .then(response => {
              if (!response.ok) {
                  throw new Error(`${file}을(를) 불러오는데 실패했습니다.`);
              }
              const contentType = response.headers.get("Content-Type");

              if (contentType.includes("image")) {
                  return response.blob(); // 이미지 Blob 변환
              } else {
                  return response.text(); // 텍스트 변환
              }
          })
          .then(data => ({ file, data })) // 파일 이름과 함께 결과 저장
          .catch(error => ({ file, error: error.message })) // 오류 발생 시 저장
  );

  // 모든 fetch가 완료된 후 실행
  Promise.all(fetchPromises).then(results => {
      results.forEach(({ file, data, error }) => {
          if (error) {
              contentDiv.innerHTML += `<p>${file}을(를) 불러오는 데 실패했습니다.</p>`;
          } else if (data instanceof Blob) {
              // 이미지인 경우
              const imgElement = document.createElement("img");
              imgElement.src = URL.createObjectURL(data);
              imgElement.style.width = "100%";
              imgElement.style.display = "block";
              contentDiv.appendChild(imgElement);
          } else {
              // 텍스트인 경우
              const textElement = document.createElement("p");
              textElement.textContent = data;
              contentDiv.appendChild(textElement);
          }
      });
  });

  // 좋아요 버튼 인터렉션
  likeButton.addEventListener("click", () => {
    likeButton.classList.toggle("active"); // 클릭할 때마다 색상 변경
  });

  // 댓글 입력 감지 인터렉션
  commentInputArea.addEventListener("input", () => {
    const text = commentInputArea.value.trim(); 
        if (text.length > 0) {
            submitButton.disabled = false; 
        } else {
            submitButton.disabled = true; 
        }
  });
});
