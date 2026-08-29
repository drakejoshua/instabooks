import passport from "passport";
import { 
    bearerAuthValidationRules, 
    bearerAuthValidationFunction 
} from "../shared.validators.js";

// authenticateJWT - This array of middleware functions is 
// used to authenticate requests using JWT (JSON Web Token) 
// with Passport.js. It first applies the bearer authentication 
// validation rules and function to validate the presence and 
// correctness of the JWT in the request. If the validation passes, 
// it then uses Passport's JWT strategy to authenticate the user 
// without creating a session.
export const authenticateJWT = [
    bearerAuthValidationRules,
    bearerAuthValidationFunction,
    passport.authenticate("jwt", { session: false })
]