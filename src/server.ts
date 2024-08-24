import app from './app'
import { port } from './config'
import Logger from './core/Logger'

app
  .listen(port, () => {
    Logger.info(`Server running in port : ${port}`)
  })
  .on('error', (e) => Logger.error(`Server root error: ${e}`))
