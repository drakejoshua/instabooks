import winston from 'winston';
import {LogtailTransport} from "@logtail/winston"
import {Logtail} from "@logtail/node"

const logtail = new Logtail( process.env.BETTER_STACK_KEY );

winston.loggers.add("development", {
    level: "info",
    format: winston.format.json(),
    transports: [
        new winston.transports.Console()
    ]
})

winston.loggers.add("production", {
    level: "info",
    format: winston.format.json(),
    transports: [
        new LogtailTransport(logtail),
    ]
})


export default winston.loggers.get( process.env.NODE_ENV )