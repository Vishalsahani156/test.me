type ApiErrorBody = {
  message?: string
  errors?: Record<string, string[] | undefined>
}

export function formatApiError(data: ApiErrorBody, fallback = 'Something went wrong'): string {
  if (data.errors) {
    const parts = Object.entries(data.errors).flatMap(([field, messages]) =>
      (messages ?? []).map((message) => `${field}: ${message}`),
    )
    if (parts.length > 0) return parts.join('. ')
  }

  return typeof data.message === 'string' ? data.message : fallback
}
