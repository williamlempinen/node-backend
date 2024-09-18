import { getConnection } from './manager'

export const sendMessage = (receiverId: number, message: string) => {
  const receiverSocket = getConnection(receiverId)

  if (receiverSocket) {
    receiverSocket.send(message)
  }
}
