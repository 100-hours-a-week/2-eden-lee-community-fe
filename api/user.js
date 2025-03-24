import { request } from "./apiClient.js";


export function signup(email, password, nickname, profileImageUrl) {
  const body = {
    email : email,
    password : password,
    nickname : nickname,
    profile_image_url : profileImageUrl
  };
  
  return request("/users", {
    method: "POST",
    body: JSON.stringify(body),
    useAuth: false,
  });
}

export function getUserInfo(userId) {
  return request(`/users/${userId}`, {
    method: "GET",
  });
}

export function updateUserProfile(userId, nickname, profileImageUrl) {
  const body = {
    nickname : nickname,
    profile_image_url : profileImageUrl
  };
  
  return request(`/users/${userId}/profile`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export function updateUserPassword(userId, password) {
  const body = {
    password : password
  };

  return request(`/users/${userId}/profile`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export function deleteUser(userId) {
  return request(`/users/${userId}`, {
    method: "DELETE",  
  });
}

export function checkEmailDuplicate(email) {
  return request(`/users/email?email=${encodeURIComponent(email)}`, {
    method: "GET",
    useAuth: false,
  });
}

export function checkNicknameDuplicate(nickname) {
  return request(`/users/nickname?nickname=${encodeURIComponent(nickname)}`, {
    method: "GET",
    useAuth: false,
  });
}
