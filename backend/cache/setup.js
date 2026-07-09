// import redis library to connect with redis
// server
import redis from "redis";

// import logger based on winston to log errors and
// critical information during redis usage
import logger from "../infra/utils/winston.js";

// initialize redis client with connection url
const redisClient = redis.createClient({
    url: process.env.REDIS_URL,
});

// handle redis cache errors and log them using configured
// logger
redisClient.on("error", function(err) {
    logger.error({
        event: "redis_error",
        message: `Redis error: ${err?.message || "Unknown error"}`,
        stack: err?.stack,
    });
});


redisClient.on("connect", function() {
    logger.info({
        event: "debug_info",
        message: "TCP connection established with Redis."
    });
})

redisClient.on("ready", function() {
    logger.info({
        event: "debug_info",
        message: `Server successfully connected to redis`
    });
})


// export initialized client for use in other parts of the
// app
export default redisClient;
