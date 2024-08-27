import { createLogger, format, transports } from "winston";

export const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.json(),
    ),
    transports: [
        new transports.Console({
            format: format.combine(
                format.colorize(), // Добавляет цвет к сообщениям в консоли
                format.simple(),
            )
        }),
        new transports.File({ filename: "logfile.log", dirname: "./logs" }),
        new transports.File({ filename: "error.log", dirname: "./logs", level: 'error' }),
    ],
});