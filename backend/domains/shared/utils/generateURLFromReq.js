// generateURLFromReq() - This function generates a full URL 
// from an Express.js request object. It constructs the URL 
// using the request's protocol, host, and original URL. This 
// is useful for creating absolute URLs for redirects or 
// links in responses.
export default function generateURLFromReq( req ) {
    const protocol = req.protocol;
    const host = req.get('host');
    const originalUrl = req.originalUrl;
    return `${protocol}://${host}${originalUrl}`;
}