import { request } from "./apiClient.js";

export function login(email, password) {
  const body = {
    email: email,
    password: password,
  };
  
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
    useAuth: false,
  });
}


