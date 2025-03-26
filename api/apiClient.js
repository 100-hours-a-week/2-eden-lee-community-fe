const BASE_URL = "http://127.0.0.1:8080";

export async function request(endpoint, options = {}) {
  try {
    const { useAuth = true, ...restOptions } = options;
    let updatedOptions = { ...restOptions };

    // localStorage에서 토큰 읽기 (useAuth가 true일 때만)
    const token = useAuth ? localStorage.getItem("accessToken") : null;

    updatedOptions.headers = {
      ...(useAuth && token ? { Authorization: `Bearer ${token}` } : {}),
      ...updatedOptions.headers,
    };

    if (!(updatedOptions.body instanceof FormData)) {
      updatedOptions.headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, updatedOptions);
    const data = await response.json();

    if (useAuth && response.status === 401) {
      localStorage.removeItem("accessToken");

      alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
      window.location.href = "/login.html";
      return;
    }

    if (!response.ok) {
      throw new Error(data.message || "API 요청 실패");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error.message);
    throw error;
  }
}
