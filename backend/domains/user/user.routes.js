// import express library to create a router 
// for user related routes
import express from 'express'

// import validation functions and rules for authentication
// on the user routes
import { 
    bearerAuthValidationFunction, 
    bearerAuthValidationRules 
} from '../shared/shared.validators.js'

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
import { authenticateJWT } from '../shared/middleware/shared.middleware.js'


// create a router for user related routes
let router = express.Router()


// validate and check bearer auth for incoming requests on 
// this route collection before procession actual data
router.use( authenticateJWT )


// POST /user/cart - add a book to the user's cart
router.post("/cart",
    addToCartValidationRules,
    cartValidationFunction,
    addToCartController
)

// PUT /user/cart/:book_id - update the quantity of a book in the 
// user's cart
router.put("/cart/:book_id",
    updateCartValidationRules,
    cartValidationFunction,
    addToCartController
)

// DELETE /user/cart/:book_id - remove a book from the user's cart
router.delete("/cart/:book_id",
    deleteFromCartValidationRules,
    cartValidationFunction,
    deleteFromCartController
)

// POST /user/address - add a new address to the user's account
router.post("/address",
    addressValidationRules,
    addressValidationFunction,
    addAddressController
)

// DELETE /user/address - delete an address from the user's account
router.delete("/address",
    addressValidationRules,
    addressValidationFunction,
    deleteAddressController
)

// export the router to be used in other parts of the application
export default router