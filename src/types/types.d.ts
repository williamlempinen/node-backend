import { ErrorType } from '../core/errors'
import { WebSocket } from 'ws'

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
  totalCount: number
  totalPages: number
  hasNextPage: boolean
}

export type PaginatedSearchQuery = {
  searchQuery?: string
  page?: number
  limit?: number
}

export type WebSocketClient = {
  ws: WebSocket
  id: string
}
