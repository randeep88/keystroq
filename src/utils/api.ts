import axios from "axios";

import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

const useApi = () => {
  const { getToken } = useAuth();

  useEffect(() => {
    const interceptor = api.interceptors.request.use(async (config) => {
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    return () => api.interceptors.request.eject(interceptor);
  }, [getToken]);

  return api;
};

export default useApi;
