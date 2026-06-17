import type { AxiosError } from 'axios';
import { API_ERROR_MESSAGES } from '@/constants/errorMessages';

function isAxiosError(error: unknown): error is AxiosError {
  return typeof error === 'object' && error !== null && 'isAxiosError' in error;
}

export function mapAxiosError(error: unknown): string {
  if (!isAxiosError(error)) {
    return error instanceof Error ? error.message : API_ERROR_MESSAGES.UNKNOWN;
  }

  if (error.response) {
    const { status } = error.response;

    if (status === 404) return API_ERROR_MESSAGES.NOT_FOUND;
    if (status >= 500) return API_ERROR_MESSAGES.SERVER_ERROR;

    return API_ERROR_MESSAGES.UNKNOWN;
  }

  if (error.code === 'ECONNABORTED') {
    return API_ERROR_MESSAGES.TIMEOUT;
  }

  if (!error.response) {
    return API_ERROR_MESSAGES.NO_CONNECTION;
  }

  return API_ERROR_MESSAGES.UNKNOWN;
}
