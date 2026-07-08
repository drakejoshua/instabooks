// import logger for logging any errors or critial info
// encountered during cache operations
import logger from "../infra/utils/winston.js"

// import redis client from setup file to allow cache
// operations
import redisClient from "./setup.js"


// pendingRequests map to track in-flight requests and prevent
// duplicate async/cache calls for the same async operation and
// prevent cache stampeding
const pendingRequests = new Map();


// getOrSetCache()
// this helper function to get data from redis cache or set it if not 
// present using a "cache-aside" strategy in combination with the async
// function
export async function getOrSetCache( req, key, asyncFunction, expiration = 3600 ) {
    try {
        // attempt to retrieve cached data from redis cache using 
        // provided key
        let cachedData = await redisClient.gey( key )

        // check if cached data exists for the provided key, if so,
        // log a "cache_hit" event and return parsed cache data
        if ( cachedData ) {
            logger.info({
                event: "cache_hit",
                cacheKey: key,
                requestId: req.requestId
            })
            
            return JSON.parse( cachedData )
        }

        // if no cached data is found for the key but there's already
        // pending request saved, wait for that request to complete and
        // return it's result to prevent duplicate API calls and cache
        // stampeding
        if ( pendingRequests.has( key ) ) {
            logger.info({
                event: "cache_pend_request",
                requestId: req.requestId,
                cacheKey: key
            })

            return await pendingRequests.get( key )
        }

        // add the key to the pending requests map
        let pendingRequest = asyncFunction()
        pendingRequests.set( key, pendingRequest )

        try {
            // if there's no cached data for the cache key and any pending 
            // request stored previously, call the provided async function
            // to retrieve fresh data
            const data = await pendingRequest;

            // log a "cache_miss" event and cache the fresh data in redis
            // with the specified expiration time
            logger.info({
                event: "cache_miss",
                cacheKey: key,
                requestId: req.requestId
            })
            await redisClient.setEx( key, expiration, JSON.stringify( data ))

            // return fresh data back to invoking function/block of code
            return data
        } finally {
            // remove the key from the pending requests map once the 
            // request is complete
            pendingRequests.delete( key )
        }
    } catch( err ) {
        // if any errors occur during the cache retrival operation,
        // log the error and rethrow it to be handled up in the execution
        // chain
        logger.error({
            event: "cache_error",
            message: `Cache error: ${ err.message || "Unknown error" }`,
            stack: err.stack,
            cacheKey: key,
            requestId: req.requestId
        })

        throw err
    }
}


// CacheKeys
// This object defines the methods used for generating cache keys for 
// storing and retrieving user data in Redis.
export const CacheKeys = {
    // Generates a cache key for storing user data by user ID.
    userById: function( userId ) {
        return `user:id:${ userId }`;
    },
    // Generates a cache key for storing user data by Google auth ID.
    userByGoogleAuthId: function( googleAuthId ) {
        return `user:google:${ googleAuthId }`;
    },
    // Generates a cache key for storing user data by email.
    userByEmail: function( email ) {
        return `user:email:${ email }`;
    },
    // Generates a cache key for storing user data by refresh token.
    userByRefreshToken: function( refreshToken ) {
        return `user:refresh:${ refreshToken }`;
    }
}


// CacheUpdate
// This object defines the methods used for updating cache entries for
// different scenarios in redis for this application.
export const CacheUpdate = {
    // Updates the cache entry for a user by their ID.
    updateUserById: async function( user ) {
        await redisClient.setEx(
            CacheKeys.userById( user._id ),
            60 * 60,             // cache expiration time in 60 mins
            JSON.stringify( user )
        )
    },
    // Updates the cache entry for a user by their Google auth ID.
    updateUserByGoogleAuthId: async function( user ) {
        await redisClient.setEx(
            CacheKeys.userByGoogleAuthId( user.google_auth_id ),
            5 * 60,             // cache expiration time in 5 mins
            JSON.stringify( user._id )
        )
    },
    // Updates the cache entry for a user by their email.
    updateUserByEmail: async function( user ) {
        await redisClient.setEx(
            CacheKeys.userByEmail( user.email ),
            5 * 60,             // cache expiration time in 5 mins
            JSON.stringify( user._id )
        )
    },
    // Updates the cache entry for a user by their refresh token.
    updateUserByRefreshToken: async function( user ) {
        await redisClient.setEx(
            CacheKeys.userByRefreshToken( user.refresh_token ),
            120 * 60,             // cache expiration time in 120 mins
            JSON.stringify( user._id )
        )
    }
}