/**
 * V-Bridge: High-Performance Edge Router
 * Optimized for speed and stealth.
 */

const PAGE_404 = `<html><head><title>404 Not Found</title></head><body><center><h1>404 Not Found</h1></center><hr><center>nginx</center></body></html>`;

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const parts = url.pathname.split('/').filter(Boolean);

    // Stealth check: Return fake Nginx page for invalid requests
    if (parts.length < 2) {
      return new Response(PAGE_404, {
        status: 404,
        headers: { 'Content-Type': 'text/html' }
      });
    }

    // Dynamic routing logic (Supports Host:Port)
    const targetHost = parts[0]; 
    const targetPath = '/' + parts.slice(1).join('/');
    const finalUrl = `https://${targetHost}${targetPath}${url.search}`;

    const newHeaders = new Headers(req.headers);
    
    // Set clean Host header (removes port if present)
    newHeaders.set('Host', targetHost.split(':')[0]);

    // Strip sensitive headers for privacy and performance
    const dropList = [
      'cf-connecting-ip', 'cf-ipcountry', 'cf-ray', 'cf-visitor', 
      'x-forwarded-for', 'x-real-ip', 'forwarded'
    ];
    dropList.forEach(h => newHeaders.delete(h));

    try {
      // High-speed fetch with manual redirect handling
      return await fetch(finalUrl, {
        method: req.method,
        headers: newHeaders,
        body: req.body,
        redirect: 'manual'
      });
    } catch (err) {
      // Silent fail to prevent detection
      return new Response(null, { status: 500 });
    }
  }
};
