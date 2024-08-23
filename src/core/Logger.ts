import { createLogger, transports, format } from "winston";

export default createLogger({
  transports: [
    new transports.Console({
      level: "debug",
      format: format.combine(
        format.errors({ stack: true }),
        format.prettyPrint(),
      ),
    }),
  ],
});
