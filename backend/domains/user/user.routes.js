import express from 'express'
import { 
    bearerAuthValidationFunction, 
    bearerAuthValidationRules 
} from '../auth/auth.validators.js'
import passport from 'passport'
import { 
    addToCartValidationFunction, 
    addToCartValidationRules, 
    updateCartValidationRules
} from './user.validators.js'
import { addToCartController } from './user.controller.js'

let router = express.Router()

router.post("/cart",
    bearerAuthValidationRules,
    bearerAuthValidationFunction,
    addToCartValidationRules,
    addToCartValidationFunction,
    passport.authenticate("jwt", { session: false }),
    addToCartController
)

router.put("/cart/:book_id",
    bearerAuthValidationRules,
    bearerAuthValidationFunction,
    updateCartValidationRules,
    addToCartValidationFunction,
    passport.authenticate("jwt", { session: false }),
    addToCartController
)

export default router