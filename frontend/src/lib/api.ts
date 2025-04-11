import axios from "axios";
import useSWR from "swr";

const isClient = typeof window !== 'undefined';

const apiBaseUrl = isClient && window.location.host.includes("localhost")
  ? "http://rickokkersen.myds.me:8000"
  : "https://cyberscope.rickokkersen.nl";

// Axios instance
export const api = axios.create({
	baseURL: `${apiBaseUrl}/api`,
	withCredentials: true,
	withXSRFToken: true,
	headers : {
		'Accept': 'application/json',
		'Content-Type': 'application/json',
	}
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

// Catch 401 errors and redirect to login
api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response.status === 401) {
			localStorage.removeItem("accessToken");
			localStorage.removeItem("user");
			window.location.href = "/login";
		}
		return Promise.reject(error);
	},
);

export const getCsrfToken = async () => {
  await axios.get(`${apiBaseUrl}/sanctum/csrf-cookie`, {
    withCredentials: true,
	withXSRFToken: true
  });
};

// Log out and redirect to login
export const logout = () => {
	localStorage.removeItem("accessToken");
	localStorage.removeItem("user"); // optional, if stored
	window.location.href = "/login";
};

// Check if user is admin (role = 1)
export const isAdmin = (profile: any) => {
	return profile?.is_admin === 1;
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