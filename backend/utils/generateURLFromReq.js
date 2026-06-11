export default function generateURLFromReq( req ) {
    const protocol = req.protocol;
    const host = req.get('host');
    const originalUrl = req.originalUrl;
    return `${protocol}://${host}${originalUrl}`;
}