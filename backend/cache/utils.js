// import logger for logging any errors or critial info
// encountered during cache operations
import logger from "../infra/utils/winston.js";

// import redis client from setup file to allow cache
// operations
import redisClient from "./setup.js";

// import the User model for interacting with the user collection
// on the database
import Users from "../database/models/user.model.js";




// pendingRequests map to track in-flight requests and prevent
// duplicate async/cache calls for the same async operation and
// prevent cache stampeding
const pendingRequests = new Map();

// getOrSetCache()
// this helper function to get data from redis cache or set it if not
// present using a "cache-aside" strategy in combination with the async
// function
async function getOrSetCache(req, key, asyncFunction, expiration = 3600) {
    try {
        // attempt to retrieve cached data from redis cache using
        // provided key
        let cachedData = await redisClient.get(key);

        // check if cached data exists for the provided key, if so,
        // log a "cache_hit" event and return parsed cache data
        if (cachedData) {
            logger.info({
                event: "cache_hit",
                cacheKey: key,
                requestId: req.requestId,
            });

            return JSON.parse(cachedData);
        }

        // if no cached data is found for the key but there's already
        // pending request saved, wait for that request to complete and
        // return it's result to prevent duplicate API calls and cache
        // stampeding
        if (pendingRequests.has(key)) {
            logger.info({
                event: "cache_pend_request",
                requestId: req.requestId,
                cacheKey: key,
            });

            return await pendingRequests.get(key);
        }

        // add the key to the pending requests map
        let pendingRequest = asyncFunction();
        pendingRequests.set(key, pendingRequest);

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
                requestId: req.requestId,
            });

            // log a "cache_set" event for tracking cache set operations
            logger.info({
                event: "cache_set",
                cacheKey: key,
                requestId: req.requestId,
                expiration: expiration,
            });

            await redisClient.setEx(key, expiration, JSON.stringify(data));

            // return fresh data back to invoking function/block of code
            return data;
        } finally {
            // remove the key from the pending requests map once the
            // request is complete
            pendingRequests.delete(key);
        }
    } catch (err) {
        // if any errors occur during the cache retrival operation,
        // log the error and rethrow it to be handled up in the execution
        // chain
        logger.error({
            event: "cache_error",
            message: `Cache error: ${err.message || "Unknown error"}`,
            stack: err.stack,
            cacheKey: key,
            requestId: req.requestId,
        });

        throw err;
    }
}

// getCache()
// this helper function to get data from redis cache using a provided key
async function getCache(req, key) {
    try {
        // attempt to retrieve cached data from redis cache using
        // provided key
        let cachedData = await redisClient.get(key);

        // check if cached data exists for the provided key, if so,
        // log a "cache_hit" event and return parsed cache data
        if (cachedData) {
            logger.info({
                event: "cache_hit",
                cacheKey: key,
                requestId: req.requestId,
            });

            return JSON.parse(cachedData);
        }

        // if no cached data is found for the key, log a "cache_miss" event
        logger.info({
            event: "cache_miss",
            cacheKey: key,
            requestId: req.requestId,
        });

        return null;
    } catch (err) {
        // if any errors occur during the cache retrival operation,
        // log the error and rethrow it to be handled up in the execution
        // chain
        logger.error({
            event: "cache_error",
            message: `Cache error: ${err.message || "Unknown error"}`,
            stack: err.stack,
            cacheKey: key,
            requestId: req.requestId,
        });

        throw err;
    }
}

// deleteCache()
// this helper function to delete data from redis cache using a
// provided key
async function deleteCache(req, key) {
    try {
        // attempt to delete cached data from redis cache using
        // provided key
        await redisClient.del(key);

        // log a "cache_delete" event for tracking cache delete operations
        logger.info({
            event: "cache_delete",
            cacheKey: key,
            requestId: req.requestId,
        });
    } catch (err) {
        // if any errors occur during the cache delete operation,
        // log the error and rethrow it to be handled up in the execution
        // chain
        logger.error({
            event: "cache_error",
            message: `Cache error: ${err.message || "Unknown error"}`,
            stack: err.stack,
            cacheKey: key,
            requestId: req.requestId,
        });

        throw err;
    }
}

// hydrateUserById()
// This helper function retrieves a user by their ID from the cache
// or database, and returns a hydrated user model instance. It first
// attempts to get the user from the cache, and if not found, retrieves
// it from the database and caches it.
async function getAndHydrateUserById(userId, req = null) {
    let user = await getOrSetCache(
        req,
        CacheKeys.userById(userId),
        async function () {
            const userData = await Users.findById(userId);

            return userData;
        },
        60 * 60, // cache expiration time in 60 mins
    );

    // hydrate the plain object gotten from the cache during
    // the google auth process to a mongoose model instance if
    // it is not already a mongoose model instance
    if (!(user instanceof Users)) {
        user = Users.hydrate(user);
    }

    return user;
}

// CacheOperations Repository
// This object defines the methods used for interacting with the cache
// for this application, including getting, setting, deleting, and
// hydrating user data.
export const CacheOperations = {
    getOrSetCache,
    getCache,
    deleteCache,
    getAndHydrateUserById,
};

// CacheTTL Repository
// This object defines the time-to-live (TTL) values for different cache
// keys used in this application, specifying how long each type of cached
// data should be retained in Redis before expiring.
export const CacheTTL = {
    bookById: 5 * 60, // 5 mins
    userById: 60 * 60, // 60 mins
    userByGoogleAuthId: 5 * 60, // 5 mins
    userByEmail: 5 * 60, // 5 mins
    userByRefreshToken: 120 * 60, // 120 mins
}


// CacheKeys Repository
// This object defines the methods used for generating cache keys for
// storing and retrieving data in Redis.
export const CacheKeys = {
    // Generates a cache key for storing user data by user ID.
    userById: function (userId) {
        return `user:id:${userId}`;
    },
    // Generates a cache key for storing user data by Google auth ID.
    userByGoogleAuthId: function (googleAuthId) {
        return `user:google:${googleAuthId}`;
    },
    // Generates a cache key for storing user data by email.
    userByEmail: function (email) {
        return `user:email:${email}`;
    },
    // Generates a cache key for storing user data by refresh token.
    userByRefreshToken: function (refreshToken) {
        return `user:refresh:${refreshToken}`;
    },
    // Generates a cache key for retrieving book data by book ID
    bookById: function( bookId ) {
        return `book:id:${bookId}`
    }
};

// CacheUpdate Repository
// This object defines the methods used for updating cache entries for
// different scenarios in redis for this application.
export const CacheUpdate = {
    // Updates the cache entry for a user by their ID.
    updateBookById: async function (book, req = null) {
        try {
            // log a "cache_set" event for tracking cache updates
            logger.info({
                event: "cache_set",
                cacheKey: CacheKeys.bookById(book._id),
                requestId: req?.requestId || "N/A",
                expiration: CacheTTL.bookById,
            });

            await redisClient.setEx(
                CacheKeys.bookById(user._id),
                CacheTTL.bookById,
                JSON.stringify(book),
            );
        } catch (err) {
            // if any errors occur during the cache update operation,
            // log the error and rethrow it to be handled up in the execution
            // chain
            logger.error({
                event: "cache_error",
                message: `Cache error: ${err.message || "Unknown error"}`,
                stack: err.stack,
                cacheKey: CacheKeys.userById(user._id),
                requestId: req?.requestId || "N/A",
            });

            throw err;
        }
    },
    // Updates the cache entry for a user by their ID.
    updateUserById: async function (user, req = null) {
        try {
            // log a "cache_set" event for tracking cache updates
            logger.info({
                event: "cache_set",
                cacheKey: CacheKeys.userById(user._id),
                requestId: req?.requestId || "N/A",
                expiration: CacheTTL.userById,
            });

            await redisClient.setEx(
                CacheKeys.userById(user._id),
                CacheTTL.userById, // cache expiration time in 60 mins
                JSON.stringify(user),
            );
        } catch (err) {
            // if any errors occur during the cache update operation,
            // log the error and rethrow it to be handled up in the execution
            // chain
            logger.error({
                event: "cache_error",
                message: `Cache error: ${err.message || "Unknown error"}`,
                stack: err.stack,
                cacheKey: CacheKeys.userById(user._id),
                requestId: req?.requestId || "N/A",
            });

            throw err;
        }
    },
    // Updates the cache entry for a user by their Google auth ID.
    updateUserByGoogleAuthId: async function (user, req = null) {
        try {
            // log a "cache_set" event for tracking cache updates
            logger.info({
                event: "cache_set",
                cacheKey: CacheKeys.userByGoogleAuthId(user.google_auth_id),
                requestId: req?.requestId || "N/A",
                expiration: CacheTTL.userByGoogleAuthId,
            });

            await redisClient.setEx(
                CacheKeys.userByGoogleAuthId(user.google_auth_id),
                CacheTTL.userByGoogleAuthId, // cache expiration time in 5 mins
                JSON.stringify(user._id),
            );
        } catch (err) {
            // if any errors occur during the cache update operation,
            // log the error and rethrow it to be handled up in the execution
            // chain
            logger.error({
                event: "cache_error",
                message: `Cache error: ${err.message || "Unknown error"}`,
                stack: err.stack,
                cacheKey: CacheKeys.userByGoogleAuthId(user.google_auth_id),
                requestId: req?.requestId || "N/A",
            });

            throw err;
        }
    },
    // Updates the cache entry for a user by their email.
    updateUserByEmail: async function (user, req = null) {
        try {
            // log a "cache_set" event for tracking cache updates
            logger.info({
                event: "cache_set",
                cacheKey: CacheKeys.userByEmail(user.email),
                requestId: req?.requestId || "N/A",
                expiration: CacheTTL.userByEmail,
            });

            await redisClient.setEx(
                CacheKeys.userByEmail(user.email),
                CacheTTL.userByEmail, // cache expiration time in 5 mins
                JSON.stringify(user._id),
            );
        } catch (err) {
            // if any errors occur during the cache update operation,
            // log the error and rethrow it to be handled up in the execution
            // chain
            logger.error({
                event: "cache_error",
                message: `Cache error: ${err.message || "Unknown error"}`,
                stack: err.stack,
                cacheKey: CacheKeys.userByEmail(user.email),
                requestId: req?.requestId || "N/A",
            });

            throw err;
        }
    },
    // Updates the cache entry for a user by their refresh token.
    updateUserByRefreshToken: async function (user, req = null) {
        try {
            // log a "cache_set" event for tracking cache updates
            logger.info({
                event: "cache_set",
                cacheKey: CacheKeys.userByRefreshToken(user.refresh_token),
                requestId: req?.requestId || "N/A",
                expiration: CacheTTL.userByRefreshToken,
            });

            await redisClient.setEx(
                CacheKeys.userByRefreshToken(user.refresh_token),
                CacheTTL.userByRefreshToken, // cache expiration time in 120 mins
                JSON.stringify(user._id),
            );
        } catch (err) {
            // if any errors occur during the cache update operation,
            // log the error and rethrow it to be handled up in the execution
            // chain
            logger.error({
                event: "cache_error",
                message: `Cache error: ${err.message || "Unknown error"}`,
                stack: err.stack,
                cacheKey: CacheKeys.userByRefreshToken(user.refresh_token),
                requestId: req?.requestId || "N/A",
            });

            throw err;
        }
    },
};


