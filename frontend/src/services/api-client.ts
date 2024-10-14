import axios from "axios";

export const BASE_API_URL = "http://127.0.0.1:8000";

export const getAPIClient = () => {
  return axios.create({
    baseURL: `${BASE_API_URL}/api/v1/`,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const apiClient = getAPIClient();
