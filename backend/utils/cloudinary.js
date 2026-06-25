import { v2 as cloudinary } from 'cloudinary'

// configure cloudinary using env variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


// export cloudinary upload function to upload files
// in other parts of the application
export async function cloudinaryUpload( fileBuffer ) {
    return new Promise( ( resolve, reject ) => {
        cloudinary.uploader.upload_stream(
            { resource_type: "image" },
            function( error, result ) {
                if ( error ) {
                    reject( error )
                } else {
                    resolve( result )
                }
            }
        ).end( fileBuffer )
    })
}


// export cloudinary delete function to delete files
// using their public id in order parts of the application
export async function cloudinaryDelete( publicId ) {
    return new Promise( ( resolve, reject ) => {
        cloudinary.uploader.destroy( 
            publicId,
            { resource_type: "image" },
            function( error, result ) {
                if ( error ) {
                    reject( error )
                } else {
                    resolve( result )
                }
            }
        )
    } )
}