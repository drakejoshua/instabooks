// import redis client from setup file to allow cache
// operations
import redisClient from "./setup.js";

// import the User model for interacting with the user collection
// on the database
import Users from "../database/models/user.model.js";

// import the Books model for interacting with the books
// collection on the databse
import Books from "../database/models/book.model.js";

// import the Orders model for interaction with the orders
// collection on the database
import Orders from "../database/models/order.model.js"
import { 
    logCacheDelete,
    logCacheError, 
    logCacheHit, 
    logCacheMiss, 
    logCachePendingRequest, 
    logCacheSet 
} from "../infra/utils/logging/logFunctions.js";

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
            logCacheHit(key);

            return JSON.parse(cachedData);
        }

        // if no cached data is found for the key but there's already
        // pending request saved, wait for that request to complete and
        // return it's result to prevent duplicate API calls and cache
        // stampeding
        if (pendingRequests.has(key)) {
            logCachePendingRequest(key);

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
            logCacheMiss(key);

            // log a "cache_set" event for tracking cache set operations
            logCacheSet(key, expiration);

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
        logCacheError(key, err);

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
            logCacheHit(key);

            return JSON.parse(cachedData);
        }

        // if no cached data is found for the key, log a "cache_miss" event
        logCacheMiss(key);

        return null;
    } catch (err) {
        // if any errors occur during the cache retrival operation,
        // log the error and rethrow it to be handled up in the execution
        // chain
        logCacheError(key, err);

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
        logCacheDelete(key);
    } catch (err) {
        // if any errors occur during the cache delete operation,
        // log the error and rethrow it to be handled up in the execution
        // chain
        logCacheError(key, err);

        throw err;
    }
}


// setCache()
// this helper function to set data in redis cache using a provided key
// and expiration time
async function setCache(req, key, data, expiration = 3600) {
    try {
        // log a "cache_set" event for tracking cache set operations
        logCacheSet(key, expiration);

        await redisClient.setEx(key, expiration, JSON.stringify(data));
    } catch (err) {
        // if any errors occur during the cache set operation,
        // log the error and rethrow it to be handled up in the execution
        // chain
        logCacheError(key, err);

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
        CacheTTL.userById, // cache expiration time
    );

    // check if a valid book is found, else return
    // null
    if ( !user ) {
        return null
    }

    // hydrate the plain object gotten from the cache during
    // the google auth process to a mongoose model instance if
    // it is not already a mongoose model instance
    if (!(user instanceof Users)) {
        user = Users.hydrate(user);
    }

    return user;
}

// hydrateBookById()
// This helper function retrieves a book by it's ID from the cache
// or database, and returns a hydrated book model instance. It first
// attempts to get the book from the cache, and if not found, retrieves
// it from the database and caches it.
async function getAndHydrateBookById(bookId, req = null) {
    let book = await getOrSetCache(
        req,
        CacheKeys.bookById(bookId),
        async function () {
            return await Books.findById(bookId);
        },
        CacheTTL.bookById, // cache expiration time
    );

    // check if a valid book is found, else return
    // null
    if ( !book ) {
        return null
    }

    // hydrate the plain object gotten from the cache during
    // the google auth process to a mongoose model instance if
    // it is not already a mongoose model instance
    if (!(book instanceof Books)) {
        book = Books.hydrate(book);
    }


    return book;
}

// getAndHydrateBooks()
// This helper function retrieves books from the cache or database,
// and returns a list of hydrated book model instances.
async function getAndHydrateBooks(limit, req = null) {
    let books = await getOrSetCache(
        req,
        CacheKeys.books(limit),
        async function () {
            return await Books.find()
                .limit(limit)
        },
        CacheTTL.books, // cache expiration time
    );

    // check if books is undefined or is an empty array
    // and return an empty array
    if ( !books || books.length === 0 ) {
        return []
    }

    // hydrate each book object to a mongoose model instance if
    // it is not already a mongoose model instance
    books = books.map((book) => {
        if (!(book instanceof Books)) {
            return Books.hydrate(book);
        }
        return book;
    });

    return books;
}

// getTotalBooksCount()
// This helper function retrieves the total count of books 
// from the cache or database.
async function getTotalBooksCount(req = null) {
    let totalBooks = await getOrSetCache(
        req,
        CacheKeys.bookCount(),
        async function () {
            return await Books.countDocuments();
        },
        CacheTTL.bookCount, // cache expiration time in 60 mins
    );

    return totalBooks;
}


// getAndHydrateSearchResults()
// This helper function retrieves search results for books
// from the cache or database, and returns a list of hydrated
// book model instances.
async function getAndHydrateSearchResults(query, req = null) {
    let searchResults = await getOrSetCache(
        req,
        CacheKeys.searchResults(query),
        async function () {
            return await Books.find({
                title: {
                    $regex: query,
                    $options: "i" // case-insensitive
                }
            })
        },
        CacheTTL.searchResults, // cache expiration time in 10 mins
    );

    // check if search results are empty or null, if so, 
    // return an empty array
    if ( !searchResults || searchResults.length === 0  ) {
        return [];
    }

    // hydrate each book object to a mongoose model instance if
    // it is not already a mongoose model instance
    searchResults = searchResults.map((book) => {
        if (!(book instanceof Books)) {
            return Books.hydrate(book);
        }
        return book;
    });

    return searchResults;
}


async function getAndHydrateOrders( limit, page, req ) {
    // get the orders for the current page and limit
    // from the cache and fallback to the database 
    // if cache doesn't contain the orders data
    let orders = await getOrSetCache(
        req,
        CacheKeys.orders( limit, page ),
        async function() {
            return await Orders.find()
                .sort({ createdAt: -1 })
                .limit( page * limit )
        },
        CacheTTL.orders
    )

    // check if orders is invalid or an empty array
    // and return and empty array to prevent integration
    // errors
    if ( !orders || orders.length === 0 ) {
        return []
    }

    // check and hydrate the orders array gotten from 
    // the cache into regular mongoose documents for
    // use later in the application
    orders = orders.map( function( order ) {
        if ( !( order instanceof Orders ) ) {
            return Orders.hydrate( order )
        }

        return order
    })

    return orders
}


// getTotalOrdersCount()
// This helper function retrieves the total count of orders 
// from the cache or database.
async function getTotalOrdersCount(req = null) {
    let totalOrders = await getOrSetCache(
        req,
        CacheKeys.ordersCount(),
        async function () {
            return await Orders.countDocuments();
        },
        CacheTTL.ordersCount, // cache expiration time in 5 mins
    );

    return totalOrders;
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
    getAndHydrateBookById,
    getAndHydrateBooks,
    getTotalBooksCount,
    getAndHydrateSearchResults,
    getAndHydrateOrders,
    getTotalOrdersCount
};

// CacheTTL Repository
// This object defines the time-to-live (TTL) values for different cache
// keys used in this application, specifying how long each type of cached
// data should be retained in Redis before expiring.
export const CacheTTL = {
    bookById: 30 * 60, // 30 mins
    bookCount: 10 * 60, // 10 mins
    searchResults: 3 * 60, // 3 mins
    userById: 60 * 60, // 60 mins
    userByGoogleAuthId: 5 * 60, // 5 mins
    userByEmail: 5 * 60, // 5 mins
    userByRefreshToken: 120 * 60, // 120 mins
    orders: 5 * 60, // 5 mins
    ordersCount: 5 * 60, // 5 mins
    books: 10 * 60 // 10 mins
};

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
    bookById: function (bookId) {
        return `book:id:${bookId}`;
    },
    // Generates a cache key for retrieving books data with a limit
    books: function (limit) {
        return `books:limit:${limit}`;
    },
    bookCount: function () {
        return `books:count`;
    },
    searchResults: function (query) {
        return `books:search:${query?.trim()?.toLowerCase()}`;
    },
    orders: function( limit, page ) {
        return `orders:limit:${limit}:page:${page}`
    },
    ordersCount: function () {
        return `orders:count`;
    }
};

// CacheUpdate Repository
// This object defines the methods used for updating cache entries for
// different scenarios in redis for this application.
export const CacheUpdate = {
    // Updates the cache entry for a user by their ID.
    updateBookById: async function (book, req = null) {
        await setCache(
            req,
            CacheKeys.bookById(book._id),
            book,
            CacheTTL.bookById, // cache expiration time in 60 mins
        );
    },
    // Updates the cache entry for a user by their ID.
    updateUserById: async function (user, req = null) {
        await setCache(
            req,
            CacheKeys.userById(user._id),
            user,
            CacheTTL.userById, // cache expiration time in 60 mins
        );
    },
    // Updates the cache entry for a user by their Google auth ID.
    updateUserByGoogleAuthId: async function (user, req = null) {
        await setCache(
            req,
            CacheKeys.userByGoogleAuthId(user.google_auth_id),
            user._id,
            CacheTTL.userByGoogleAuthId, // cache expiration time in 5 mins
        );
    },
    // Updates the cache entry for a user by their email.
    updateUserByEmail: async function (user, req = null) {
        await setCache(
            req,
            CacheKeys.userByEmail(user.email),
            user._id,
            CacheTTL.userByEmail, // cache expiration time in 5 mins
        );
    },
    // Updates the cache entry for a user by their refresh token.
    updateUserByRefreshToken: async function (user, req = null) {
        await setCache(
            req,
            CacheKeys.userByRefreshToken(user.refresh_token),
            user._id,
            CacheTTL.userByRefreshToken, // cache expiration time in 120 mins
        );
    },
};
