import { ErrorType } from '../core/errors'

interface RequestError {
  type: ErrorType
  errorMessage: string
  errorDetails?: any
}

export type RepoResponse<T> = Promise<[T | null, RequestError | null]>
