import axios, { AxiosRequestConfig } from "axios";

export const BASE_URL = process.env.REACT_APP_API_URL as string;

/**
 * Requisição genérica para o back-end
 * @param config - AxiosRequestConfig
 * @returns Resposta HTTP
 */
export const requestBackend = (config: AxiosRequestConfig) => {
  const headers = {
    ...config.headers,
  };

  return axios({
    ...config,
    baseURL: BASE_URL,
    headers,
  });
};
