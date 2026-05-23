const DEFAULT_API_ERROR_MESSAGE = 'Não foi possível concluir a operação.';

export function getApiErrorMessage(response) {
  if (!response) {
    return DEFAULT_API_ERROR_MESSAGE;
  }

  if (response.error?.message) {
    return response.error.message;
  }

  if (response.message) {
    return response.message;
  }

  if (Array.isArray(response.detail)) {
    return response.detail
      .map((error) => error?.msg)
      .filter(Boolean)
      .join(' ') || DEFAULT_API_ERROR_MESSAGE;
  }

  if (typeof response.detail === 'string') {
    return response.detail;
  }

  return DEFAULT_API_ERROR_MESSAGE;
}
