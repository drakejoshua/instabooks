import express from 'express'
import { 
    bearerAuthValidationFunction, 
    bearerAuthValidationRules 
} from '../auth/auth.validators.js'
import passport from 'passport'
import { 
    addressValidationFunction,
    addressValidationRules,
    addToCartValidationRules, 
    cartValidationFunction, 
    deleteFromCartValidationRules, 
    updateCartValidationRules
} from './user.validators.js'
import { 
    addAddressController,
    addToCartController, 
    deleteAddressController, 
    deleteFromCartController,
} from './user.controller.js'

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
    deleteFromCartController
)

router.post("/address",
    bearerAuthValidationRules,
    bearerAuthValidationFunction,
    addressValidationRules,
    addressValidationFunction,
    passport.authenticate( "jwt", { session: false } ),
    addAddressController
)

router.delete("/address",
    bearerAuthValidationRules,
    bearerAuthValidationFunction,
    addressValidationRules,
    addressValidationFunction,
    passport.authenticate( "jwt", { session: false } ),
    deleteAddressController
)

export default router