export class AppError extends Error {
  statusCode: number

  constructor(message: string, statusCode = 500) {
    super(message)
    this.name = 'AppError'
    this.statusCode = statusCode
  }
}

export function assertFound<T>(value: T | null | undefined, message = 'Not found'): T {
  if (!value) throw new AppError(message, 404)
  return value
}
