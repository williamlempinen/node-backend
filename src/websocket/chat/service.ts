import Logger from '../../core/Logger'
import MessageRepo from '../../database/repository/MessageRepo'
import { getConnection } from './manager'

export const sendMessage = (receiverId: number, message: string) => {
  const receiverSocket = getConnection(receiverId)
  Logger.info('RECEIVER ID: ', receiverId)
  Logger.info('RECEIVER SOCKET: ', receiverSocket)

  if (receiverSocket) {
    receiverSocket.send(message)
  }
}

type MessageDataType = {
  content: string
  senderId: string
  conversationId: string
}

export const createMessage = async (message: any) => {
  Logger.info('RECEIVED: ', JSON.stringify(message))

  const mes = JSON.parse(message)
  Logger.info('PARSED: ', JSON.stringify(mes))
  const m = {
    content: mes.content as string,
    senderId: mes.sender_id as string,
    conversationId: mes.conversation_id as string
  }

  const [messageCreated, error] = await MessageRepo.createMessage(m)
  if (messageCreated) Logger.info('ADDED NEW MESSAGE')
}
