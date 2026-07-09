// import redis library to connect with redis
// server
import redis from "redis";

// import logger based on winston to log errors and
// critical information during redis usage
import logger from "../infra/utils/winston.js";

// initialize redis client with connection url
const redisClient = redis.createClient({
    url: process.env.REDIS_URL,
    socket: {
        reconnectStrategy: function( retries ) {
            if ( retries > 5 ) {
                return new Error("Too many retries, Redis server unavailable")
            }

            // stagger the retry waiting time based on the number of retries
            // ( i.e. 1st = 500ms, 2nd = 1000ms, etc )
            return retries * 500
        }
    }
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
        event: "redis_connect",
        message: "TCP connection established with Redis."
    });
})

redisClient.on("ready", function() {
    logger.info({
        event: "redis_connect_success",
        message: `Server successfully connected to redis`
    });
})


// export initialized client for use in other parts of the
// app
export default redisClient;
