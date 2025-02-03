const API_URL = "https://api.thibault-api.com/api";

export const apiService = {
  async request(endpoint, options = {}) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      credentials: "include",
      ...options,
    });

    if (!response.ok) {
      if (response.status === 401) {
        window.location.href = "/";
      }
      const errorData = await response.json();
      throw new Error(errorData.error || "Une erreur est survenue");
    }

    return response.json();
  },

  async post(endpoint, body = {}, headers = {}) {
    return this.request(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify(body),
    });
  },

  async postFormUrlEncoded(endpoint, body, headers = {}) {
    const formBody = Object.keys(body)
      .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(body[key])}`)
      .join("&");

    return this.request(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        ...headers,
      },
      body: formBody,
    });
  },

  async get(endpoint, headers = {}) {
    return this.request(endpoint, {
      method: "GET",
      headers: { "Content-Type": "application/json", ...headers },
    });
  },

  async put(endpoint, body = {}, headers = {}) {
    return this.request(endpoint, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify(body),
    });
  },

  async delete(endpoint, headers = {}) {
    return this.request(endpoint, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", ...headers },
    });
  },
};
