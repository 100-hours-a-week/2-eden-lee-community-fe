import { request } from "./apiClient.js";

export function createComment(userId, postId, contents) {
  const body = {
    user_id : userId,
    post_id : postId,
    contents : contents,
  };

  return request("/comments", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function updateComment(commentId, contents) {
  const body = {
    contents : contents,
  };

  return request(`/comments/${commentId}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export function deleteComment(commentId) {
  return request(`/comments/${commentId}`, {
    method: "DELETE",
  });
}
