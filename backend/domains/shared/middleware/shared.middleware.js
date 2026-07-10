import passport from "passport";
import { 
    bearerAuthValidationRules, 
    bearerAuthValidationFunction 
} from "../shared.validators.js";

export const authenticateJWT = [
    bearerAuthValidationRules,
    bearerAuthValidationFunction,
    passport.authenticate("jwt", { session: false })
]