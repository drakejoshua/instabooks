// import express library to create a router 
// for user related routes
import express from 'express'

// import validation functions and rules for authentication
// on the user routes
import { 
    bearerAuthValidationFunction, 
    bearerAuthValidationRules 
} from '../auth/auth.validators.js'

// import passport library to handle authentication
import passport from 'passport'

// import validation functions, rules and controllers for user routes
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


// create a router for user related routes
let router = express.Router()


// POST /user/cart - add a book to the user's cart
router.post("/cart",
    bearerAuthValidationRules,
    bearerAuthValidationFunction,
    addToCartValidationRules,
    cartValidationFunction,
    passport.authenticate("jwt", { session: false }),
    addToCartController
)

// PUT /user/cart/:book_id - update the quantity of a book in the 
// user's cart
router.put("/cart/:book_id",
    bearerAuthValidationRules,
    bearerAuthValidationFunction,
    updateCartValidationRules,
    cartValidationFunction,
    passport.authenticate("jwt", { session: false }),
    addToCartController
)

// DELETE /user/cart/:book_id - remove a book from the user's cart
router.delete("/cart/:book_id",
    bearerAuthValidationRules,
    bearerAuthValidationFunction,
    deleteFromCartValidationRules,
    cartValidationFunction,
    passport.authenticate("jwt", { session: false }),
    deleteFromCartController
)

// POST /user/address - add a new address to the user's account
router.post("/address",
    bearerAuthValidationRules,
    bearerAuthValidationFunction,
    addressValidationRules,
    addressValidationFunction,
    passport.authenticate( "jwt", { session: false } ),
    addAddressController
)

// DELETE /user/address - delete an address from the user's account
router.delete("/address",
    bearerAuthValidationRules,
    bearerAuthValidationFunction,
    addressValidationRules,
    addressValidationFunction,
    passport.authenticate( "jwt", { session: false } ),
    deleteAddressController
)

// export the router to be used in other parts of the application
export default router