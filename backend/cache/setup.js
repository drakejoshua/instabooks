// import redis library to connect with redis
// server
import redis from "redis";

import { 
    logRedisConnect, 
    logRedisConnectSuccess, 
    logRedisError 
} from "../infra/utils/logging/logFunctions.js";

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
    logRedisError(err)
});


redisClient.on("connect", function() {
    logRedisConnect()
})

redisClient.on("ready", function() {
    logRedisConnectSuccess()
})


// export initialized client for use in other parts of the
// app
export default redisClient;