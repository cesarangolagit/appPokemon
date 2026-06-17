import { API_ERROR_MESSAGES } from '@/constants/errorMessages';
import { mapAxiosError } from '@/api/mapAxiosError';

describe('mapAxiosError', () => {
  it('maps 404 to not found message', () => {
    expect(
      mapAxiosError({
        isAxiosError: true,
        response: { status: 404 },
      })
    ).toBe(API_ERROR_MESSAGES.NOT_FOUND);
  });

  it('maps 500+ to server error message', () => {
    expect(
      mapAxiosError({
        isAxiosError: true,
        response: { status: 503 },
      })
    ).toBe(API_ERROR_MESSAGES.SERVER_ERROR);
  });

  it('maps timeout to timeout message', () => {
    expect(
      mapAxiosError({
        isAxiosError: true,
        code: 'ECONNABORTED',
      })
    ).toBe(API_ERROR_MESSAGES.TIMEOUT);
  });

  it('maps network errors to no connection message', () => {
    expect(
      mapAxiosError({
        isAxiosError: true,
      })
    ).toBe(API_ERROR_MESSAGES.NO_CONNECTION);
  });

  it('falls back to unknown for unhandled axios errors', () => {
    expect(
      mapAxiosError({
        isAxiosError: true,
        response: { status: 418 },
      })
    ).toBe(API_ERROR_MESSAGES.UNKNOWN);
  });

  it('returns message from generic Error instances', () => {
    expect(mapAxiosError(new Error('Fallo custom'))).toBe('Fallo custom');
  });
});
