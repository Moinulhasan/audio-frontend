const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost/api";

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("auth_token");

  const isFormData = options.body instanceof FormData;
  const headers: any = {
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    // Handle unauthenticated state
    if (response.status === 401 && !endpoint.includes("/login")) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_session");
      window.location.href = "/login";
    }

    throw {
      status: response.status,
      message: data.message || "Something went wrong",
      errors: data.errors,
    };
  }

  return data;
}
