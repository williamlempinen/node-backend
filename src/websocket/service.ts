import Logger from '../core/Logger'
import MessageRepo from '../database/repository/MessageRepo'
import { validator } from './validator'
import Message from '../routes/message/schema'
import { WebSocket } from 'ws'
import { WebSocketClient } from 'types'

// this is same type used in routes/message/createMessage.ts
// where Zod is used instead of type
type MessageDataType = {
  content: string
  senderId: string
  conversationId: string
}

type WebSocketResponse = {
  data: any | null
  error: boolean
}

export const createMessage = async (message: any): Promise<WebSocketResponse> => {
  try {
    const { isValid, data, error } = validator(Message.full, JSON.parse(message))
    if (!isValid || error) {
      return { data: null, error: true }
    }

    const newMessage: MessageDataType = {
      content: data.content,
      senderId: data.sender_id,
      conversationId: data.conversation_id
    }

    const [messageCreated, messageCreatedError] = await MessageRepo.createMessage(newMessage)
    if (messageCreatedError) {
      return { data: null, error: true }
    }

    return { data: messageCreated, error: false }
  } catch (error: any) {
    Logger.error(`Error in creating message from websocket input`)
    return { data: null, error: true }
  }
}

export const createConnectionType = (webSocket: WebSocket): WebSocketClient => {
  const rnd = Math.random().toString(36).substr(2, 9)
  return { ws: webSocket, id: rnd }
}
