import { ErrorType } from '../core/errors'

type RequestError = {
  type: ErrorType
  errorMessage: string
  errorDetails?: any
}

export type RepoResponse<T> = Promise<[T | null, RequestError | null]>

export type Paginated<T> = {
  data: T[]
  page: number
  limit: number
  totalCount?: number
}

export type PaginatedSearchQuery = {
  searchQuery?: string
  page?: number
  limit?: number
}
