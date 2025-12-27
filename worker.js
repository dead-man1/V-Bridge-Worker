/**
 * V-Bridge-Worker
 * A high-performance, stealthy, and universal edge data relay.
 * Optimized for low-latency streaming and bi-directional masking.
 */

const DECOY_HTML = `<html><head><title>404 Not Found</title></head><body><center><h1>404 Not Found</h1></center><hr><center>nginx</center></body></html>`;
const FILTER_LIST = new Set(['/favicon.ico', '/robots.txt', '/.env', '/.git']);
const REQ_STRIP = ['cf-connecting-ip', 'cf-ipcountry', 'cf-ray', 'cf-visitor', 'x-forwarded-for', 'x-real-ip', 'forwarded'];
const RES_STRIP = ['cf-ray', 'alt-svc', 'cf-cache-status', 'x-powered-by', 'x-cloudflare-request-id'];

export default {
  /**
   * Main fetch handler
   */
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      const path = url.pathname;

      // 1. Resource Preservation & Stealth Engine
      if (path === '/' || FILTER_LIST.has(path)) {
        return new Response(path === '/' ? DECOY_HTML : null, {
          status: path === '/' ? 404 : 204,
          headers: { 
            'content-type': 'text/html',
            'server': 'nginx' 
          }
        });
      }

      const segments = path.split('/').filter(Boolean);
      if (segments.length < 2) {
        return new Response(DECOY_HTML, { status: 404, headers: { 'server': 'nginx' } });
      }

      // 2. Dynamic Routing Logic
      let hostIndex = 0;
      let protocol = 'https';

      if (segments[0] === 'http' || segments[0] === 'https') {
        protocol = segments[0];
        hostIndex = 1;
      }

      const targetHost = segments[hostIndex];
      const targetPath = '/' + segments.slice(hostIndex + 1).join('/');
      const destination = `${protocol}://${targetHost}${targetPath}${url.search}`;

      // 3. Header Sanitization
      const newHeaders = new Headers(request.headers);
      newHeaders.set('Host', targetHost.split(':')[0]);
      REQ_STRIP.forEach(h => newHeaders.delete(h));

      // 4. Relay Configuration
      const relayConfig = {
        method: request.method,
        headers: newHeaders,
        redirect: 'manual',
        signal: request.signal,
        cf: { cacheTtl: 0, cacheEverything: false }
      };

      if (request.method !== 'GET' && request.method !== 'HEAD') {
        relayConfig.body = request.body;
      }

      // 5. Execution with Auto-Fallback (SSL Resilience)
      let response = await fetch(destination, relayConfig);
      
      if (response.status >= 525 && protocol === 'https') {
        const fallbackUrl = `http://${targetHost}${targetPath}${url.search}`;
        response = await fetch(fallbackUrl, relayConfig);
      }

      // 6. Protocol Upgrade Handling (WebSocket Support)
      if (response.status === 101 || request.headers.get('Upgrade')?.toLowerCase() === 'websocket') {
        return response;
      }

      // 7. Response Masking (Stealth Engine)
      const outHeaders = new Headers(response.headers);
      RES_STRIP.forEach(h => outHeaders.delete(h));
      
      outHeaders.set('Server', 'nginx');
      outHeaders.set('Cache-Control', 'no-store, no-cache, must-revalidate');
      outHeaders.set('X-Content-Type-Options', 'nosniff');

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: outHeaders
      });

    } catch (err) {
      // Silent fail to maintain invisibility
      return new Response(null, { status: 499 });
    }
  }
};
