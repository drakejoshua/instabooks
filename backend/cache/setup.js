// import redis library to connect with redis
// server
import redis from 'redis';

// import logger based on winston to log errors and
// critical information during redis usage
import logger from "../domains/shared/utils/winston.js"



// initialize redis client with connection url
const redisClient = redis.createClient({
    url: process.env.REDIS_URL
})


// handle redis cache errors and log them using configured
// logger
redisClient.on("error", function( err ) {
    logger.error({
        event: "redis_error",
        message: `Redis error: ${ err?.message 
            || "Unknown error"}`,
        stack: err?.stack
    })
})


// export initialized client for use in other parts of the 
// app
export default redisClient