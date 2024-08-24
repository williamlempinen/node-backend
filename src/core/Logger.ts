import * as w from 'winston'

const { combine, timestamp, printf, colorize, align } = w.format

const Logger = w.createLogger({
  level: 'debug',
  format: combine(
    colorize({ all: true }),
    timestamp({
      format: 'YYYY-MM-DD hh:mm:ss'
    }),
    align(),
    printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
  ),
  transports: [new w.transports.Console()]
})

export default Logger
