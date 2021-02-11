import pkg from "winston"
const { createLogger, format, transports } = pkg

const logger = createLogger({
    transports: [
        new transports.Console({ level: "info", format: format.combine(format.json(), format.timestamp()) }),
        new transports.File({
            filename: "info.log",
            level: "info",
            format: format.combine(format.json(), format.timestamp())
        }),
        new transports.File({
            filename: "error.log",
            level: "error",
            format: format.combine(format.json(), format.timestamp())
        }),
    ]
})

export default logger;