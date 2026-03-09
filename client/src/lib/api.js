const API_URL = "http://localhost:5000";

export function getToken() {
  return localStorage.getItem("token");
}

export function getAuthHeaders() {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export { API_URL };