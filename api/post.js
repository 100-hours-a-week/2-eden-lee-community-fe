import { request } from "./apiClient.js";

export function getAllpost() {
  return request("/posts", {
    method: "GET",
  });
}

export function getPost(postId) {
  return request(`/posts/${postId}`, {
    method: "GET",
  });
}

export function createPost(formData) {
  return request("/posts", {
    method: "POST",
    body: formData,
  });
}

export function updatePost(postId, formData) {
  return request(`/posts/${postId}`, {
    method: "PUT",
    body: formData,
  });
}

export function deletePost(postId) {
  return request(`/posts/${postId}`, {
    method: "DELETE",
  });
}

export function likePost(postId, userId) {
  const body = {
    user_id: userId,
  };
  return request(`/posts/${postId}/likes`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function increasePostViews(postId) {
  return request(`/posts/${postId}/views`, {
    method: "PATCH",
  });
}
