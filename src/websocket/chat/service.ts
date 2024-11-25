import Logger from '../../core/Logger'
import MessageRepo from '../../database/repository/MessageRepo'
import { validator } from '../validator'
import Message from '../../routes/message/schema'

type MessageDataType = {
  content: string
  senderId: string
  conversationId: string
}

type WebSocketResponse = {
  success: any | null
  error: boolean
}

export const createMessage = async (message: any): Promise<WebSocketResponse> => {
  try {
    const { isValid, data, error } = validator(Message.full, JSON.parse(message))
    if (!isValid || error) {
      return { success: null, error: true }
    }

    Logger.info(`VALIDATED DATA ${data}`)

    const newMessage: MessageDataType = {
      content: data.content,
      senderId: data.sender_id,
      conversationId: data.conversation_id
    }

    const [messageCreated, messageCreatedError] = await MessageRepo.createMessage(newMessage)
    if (messageCreatedError) {
      return { success: null, error: true }
    }

    return { success: messageCreated, error: false }
  } catch (error: any) {
    Logger.error(`Error in creating message from websocket input`)
    return { success: null, error: true }
  }
}
