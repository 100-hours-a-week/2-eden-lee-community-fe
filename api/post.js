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

export function createPost(userId, title, text, imageUrl) {
  const body = {
    user_id: userId,
    title: title,
    contents: {
      text: text,
      image_url: imageUrl,
    },
  };

  return request("/posts", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function updatePost(postId, title, text, imageUrl) {
  const body = {
    title: title,
    contents: {
      text: text,
      image_url: imageUrl,
    },
  };

  return request(`/posts/${postId}`, {
    method: "PUT",
    body: JSON.stringify(body),
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
