/**
 * V-Bridge: Final Stable Edition
 * Fixed WebSocket Handshake & GET Body issues.
 */

const MASK_PAGE = `<html><head><title>404 Not Found</title></head><body><center><h1>404 Not Found</h1></center><hr><center>nginx</center></body></html>`;

export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);
      const segments = url.pathname.split('/').filter(Boolean);

      // 1. Stealth & Root Check
      if (segments.length < 2) {
        return new Response(MASK_PAGE, {
          status: 404,
          headers: { 'content-type': 'text/html', 'server': 'nginx' }
        });
      }

      // 2. Construct Destination
      const targetHost = segments[0];
      const targetPath = '/' + segments.slice(1).join('/');
      const destination = `https://${targetHost}${targetPath}${url.search}`;

      // 3. Prepare Headers
      const newHeaders = new Headers(request.headers);
      newHeaders.set('Host', targetHost.split(':')[0]);
      
      // Clean sensitive headers
      ['cf-connecting-ip', 'cf-ipcountry', 'cf-ray', 'cf-visitor', 'x-forwarded-for', 'x-real-ip'].forEach(h => newHeaders.delete(h));

      // 4. Handle Request (Fix: No body for GET/HEAD)
      const fetchConfig = {
        method: request.method,
        headers: newHeaders,
        redirect: 'manual'
      };

      if (request.method !== 'GET' && request.method !== 'HEAD') {
        fetchConfig.body = request.body;
      }

      // 5. Execute Fetch
      const response = await fetch(destination, fetchConfig);

      // 6. Handle WebSocket Upgrade (Critical for VLESS)
      if (request.headers.get('Upgrade')?.toLowerCase() === 'websocket') {
        return response;
      }

      // 7. Mask Regular Responses (Nginx Spoofing)
      const outHeaders = new Headers(response.headers);
      ['cf-ray', 'alt-svc', 'cf-cache-status', 'x-powered-by'].forEach(h => outHeaders.delete(h));
      outHeaders.set('Server', 'nginx');

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: outHeaders
      });

    } catch (err) {
      return new Response(null, { status: 499 });
    }
  }
};
