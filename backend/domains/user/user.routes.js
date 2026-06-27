import express from 'express'
import { bearerAuthValidationFunction, bearerAuthValidationRules } from '../auth/auth.validators'
import passport from 'passport'

let router = express.Router()

router.post("/cart",
    bearerAuthValidationRules,
    bearerAuthValidationFunction,
    addToCartValidationRules,
    addToCartValidationFunction,
    passport.authenticate("jwt", { session: false }),
    addToCartController
)


export default router