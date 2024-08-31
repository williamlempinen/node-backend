interface BaseSuccess<T> {
  success: true
  data: T
}

interface BaseError {
  errorMessage: string
  errorDetails?: any
}

export type RepoResponse<T> = BaseSuccess<T> | BaseError
