import multer from 'multer'
import { fileFilterError } from '../../domains/shared/utils/errors.js'


// fileFilter()
// this function acts as a callback to filter files based 
// on their mimetype. It checks if the uploaded file is 
// an image by verifying if the mimetype starts with "image/". 
// If the file is an image, it allows the upload to proceed; 
// otherwise, it rejects the upload and returns a file filter error.
function fileFilter( req, file, cb ) {
    if ( file.mimetype.startsWith("image/") ) {
        cb( null, true )
    } else {
        cb( fileFilterError, false )
    }
}


// create and export upload middleware for use in other parts
// of the app
const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 2       // 2 MB
    }
})

export default upload