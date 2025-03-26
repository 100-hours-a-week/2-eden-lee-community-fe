import { request } from "./apiClient.js";


export function signup(formData) {
  return request("/users", {
    method: "POST",
    body: formData,
    useAuth: false,
  });
}

export function getUserInfo(userId) {
  return request(`/users/${userId}`, {
    method: "GET",
  });
}

export function updateUserProfile(userId, formData) {
  return request(`/users/${userId}/profile`, {
    method: "PUT",
    body: formData,
  });
}

export function updateUserPassword(userId, password) {
  const body = {
    password : password
  };

  return request(`/users/${userId}/password`, {
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
