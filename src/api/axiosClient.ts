import axios from 'axios';
import { mapAxiosError } from '@/api/mapAxiosError';

export const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';
export const POKEAPI_TIMEOUT_MS = 15_000;

export const pokeApiClient = axios.create({
  baseURL: POKEAPI_BASE_URL,
  timeout: POKEAPI_TIMEOUT_MS,
  headers: {
    Accept: 'application/json',
  },
});

pokeApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    error.message = mapAxiosError(error);
    return Promise.reject(error);
  }
);
