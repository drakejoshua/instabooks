import express from 'express'
import { 
    bearerAuthValidationFunction, 
    bearerAuthValidationRules 
} from '../auth/auth.validators.js'
import passport from 'passport'
import { 
    addToCartValidationRules, 
    cartValidationFunction, 
    deleteFromCartValidationRules, 
    updateCartValidationRules
} from './user.validators.js'
import { addToCartController } from './user.controller.js'

let router = express.Router()

router.post("/cart",
    bearerAuthValidationRules,
    bearerAuthValidationFunction,
    addToCartValidationRules,
    cartValidationFunction,
    passport.authenticate("jwt", { session: false }),
    addToCartController
)

router.put("/cart/:book_id",
    bearerAuthValidationRules,
    bearerAuthValidationFunction,
    updateCartValidationRules,
    cartValidationFunction,
    passport.authenticate("jwt", { session: false }),
    addToCartController
)

router.delete("/cart/:book_id",
    bearerAuthValidationRules,
    bearerAuthValidationFunction,
    deleteFromCartValidationRules,
    cartValidationFunction,
    passport.authenticate("jwt", { session: false }),
    
)

export default router