export async function createPost(postData) {
  try {
      // TODO
      // const response = await fetch("/api/posts", {
      //     method: "POST",
      //     body: postData, // FormData 그대로 사용
      // });

      // if (!response.ok) {
      //     throw new Error("게시글 등록 실패");
      // }

      // return response; // 성공하면 응답 반환
      return true;
  } catch (error) {
      console.error("Error:", error);
      throw error;
  }
}
