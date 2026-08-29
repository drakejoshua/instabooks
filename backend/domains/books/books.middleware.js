import rateLimit from "express-rate-limit";
import { RateLimitExceededError } from "../shared/utils/errors.js";

export const publicBooksLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 50, // Limit each IP to 50 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (req, res, next) => {
        return next(RateLimitExceededError);
    }
});