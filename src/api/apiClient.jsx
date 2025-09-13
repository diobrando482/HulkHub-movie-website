import axios from "axios";

const API_KEY = "xXtUbZckST4pKc1CrKFY0WMBK5wUt1iWn5yxw8YM";
const BASE_URL = "https://api.themoviedb.org/3";

const apiClient = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: "en-US",
  },
});

export default apiClient;
