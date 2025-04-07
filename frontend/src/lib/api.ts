import axios from "axios";
import useSWR from "swr";

// const apiBaseUrl = window.location.host.includes("localhost")
//   ? "http://localhost:3001"
//   : "https://your-api-domain.com";

// Axios instance
export const api = axios.create({
	baseURL: "https://api-cyberscope.rickokkersen.nl/api",
	withCredentials: true,
});

// Automatically attach token
api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("accessToken");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error),
);

export const getCsrfToken = async () => {
  await axios.get("https://api-cyberscope.rickokkersen.nl/sanctum/csrf-cookie", {
    withCredentials: true,
  });
};

// Log out and redirect to login
export const logout = () => {
	localStorage.removeItem("accessToken");
	localStorage.removeItem("user"); // optional, if stored
	window.location.href = "/login";
};

// SWR fetcher using axios
const fetcher = (url: string) => api.get(url).then((res) => res.data);

// Generic data hook
export const useData = (apiPath: string, swrOptions = {}) => {
	const { data, error, mutate } = useSWR(apiPath, fetcher, swrOptions);
	return { data, error, mutate };
};

// Hook to get current user profile
export const useProfile = () => {
	const { data, error, mutate } = useSWR("/user", fetcher);
	return {
		profile: data,
		error,
		mutate,
		isLoading: !data && !error,
	};
};