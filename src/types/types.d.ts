import { ErrorType } from '../core/errors'
import { WebSocket } from 'ws'

type RequestError = {
  type: ErrorType
  errorMessage: string
  errorDetails?: any
}

type RepoResponse<T> = Promise<[T | null, RequestError | null]>

type Paginated<T> = {
  data: T[]
  page: number
  limit: number
  totalCount: number
  totalPages: number
  hasNextPage: boolean
}

type PaginatedSearchQuery = {
  searchQuery?: string
  page?: number
  limit?: number
}

type WebSocketClient = {
  ws: WebSocket
  id: string
}
