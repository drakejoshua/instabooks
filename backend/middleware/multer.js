import multer from 'multer'
import { fileFilterError } from '../utils/errors.js'


// fileFilter()
// this function acts as a callback to 
function fileFilter( req, file, cb ) {
    if ( file.mimetype.startsWith("image/") ) {
        cb( null, true )
    } else {
        cb( fileFilterError, false )
    }
}


// create upload middleware for use in other parts
// of the app
const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 2       // 2 MB
    }
})

export default upload