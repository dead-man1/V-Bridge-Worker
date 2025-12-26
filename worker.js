/**
 * V-Bridge Worker: A Universal Reverse Proxy for WebSocket-based Protocols.
 * 
 * This worker acts as a stealthy bridge to bypass network restrictions.
 * It dynamically routes traffic to any target host specified in the URL path.
 */

const FAKE_PAGE = `
<html>
  <head><title>404 Not Found</title></head>
  <body>
    <center><h1>404 Not Found</h1></center>
    <hr><center>nginx</center>
  </body>
</html>`;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/').filter(Boolean);

    // 1. Stealth Mode: Return fake 404 if the request is invalid or direct access
    if (pathParts.length < 2) {
      return new Response(FAKE_PAGE, {
        status: 404,
        headers: { 'Content-Type': 'text/html' }
      });
    }

    // 2. Extract Target Information
    // Format: https://your-worker.dev/TARGET_HOST/TARGET_PATH
    const targetHost = pathParts[0];
    const targetPath = '/' + pathParts.slice(1).join('/');
    const targetUrl = `https://${targetHost}${targetPath}${url.search}`;

    // 3. Prepare Clean Headers
    const newHeaders = new Headers(request.headers);
    
    // Set Host header to target to avoid SNI mismatch at destination
    newHeaders.set('Host', targetHost);

    // Remove Cloudflare-specific headers to increase anonymity
    const headersToRemove = [
      'cf-connecting-ip',
      'cf-ipcountry',
      'cf-ray',
      'cf-visitor',
      'x-forwarded-for',
      'x-real-ip'
    ];
    headersToRemove.forEach(h => newHeaders.delete(h));

    // 4. Proxy the Request
    try {
      const response = await fetch(targetUrl, {
        method: request.method,
        headers: newHeaders,
        body: request.body,
        redirect: 'manual' // Important for maintaining tunnel integrity
      });

      // 5. Return the response as-is (Supports WebSocket & UDP encapsulation)
      return response;

    } catch (error) {
      // Log error internally if needed, but return a generic response to the user
      return new Response(null, { status: 500 });
    }
  }
};
