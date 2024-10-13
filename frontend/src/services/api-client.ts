import axios from "axios";

export const getAPIClient = () => {
  return axios.create({
    baseURL: "http://127.0.0.1:8000/api/v1/",
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const apiClient = getAPIClient();
