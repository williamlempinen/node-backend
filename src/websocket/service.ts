import Logger from '../core/Logger'
import MessageRepo from '../database/repository/MessageRepo'
import { validator } from './validator'
import Message from '../routes/message/schema'
import { WebSocket } from 'ws'
import { WebSocketClient } from 'types'
import ConversationRepo from '../database/repository/ConversationRepo'
import UserRepo from '../database/repository/UserRepo'

// this is the same type used in
// routes/message/createMessage.ts
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

//todo
export const updateIsSeen = async (message: any): Promise<WebSocketResponse> => {
  try {
    const { conversationId, id } = JSON.parse(message)
    Logger.info(`Conversation id: ${conversationId} and user id: ${id}`)

    const [isUserActive, errorUserActive] = await UserRepo.isUserActive(id)
    if (errorUserActive) {
      return { data: null, error: true }
    }

    const [updatedAsSeen, errorUpdateMessages] = await ConversationRepo.updateMessagesAsSeen(
      parseInt(conversationId),
      parseInt(id)
    )
    if (errorUpdateMessages) {
      return { data: null, error: true }
    }

    return { data: updatedAsSeen, error: false }
  } catch (error: any) {
    Logger.error(`Error in updating messages as seen on new messages`)
    return { data: null, error: true }
  }
}

//todo
export const updateIsPresent = async (something: any) => {}

export const createConnectionType = (webSocket: WebSocket): WebSocketClient => {
  const rnd = Math.random().toString(36).substr(2, 9)
  return { ws: webSocket, id: rnd }
}
