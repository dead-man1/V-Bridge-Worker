/**
 * V-Bridge-Worker
 * A high-performance, stealthy, and universal edge data relay.
 * Optimized for low-latency streaming and bi-directional masking.
 */

const D = `<html><head><title>404 Not Found</title></head><body><center><h1>404 Not Found</h1></center><hr><center>nginx</center></body></html>`;
const F = new Set(['/favicon.ico', '/robots.txt', '/.env', '/.git']);
const H_IN = ['cf-connecting-ip', 'cf-ipcountry', 'cf-ray', 'cf-visitor', 'x-forwarded-for', 'x-real-ip', 'forwarded'];
const H_OUT = ['cf-ray', 'alt-svc', 'cf-cache-status', 'x-powered-by', 'x-cloudflare-request-id'];
const P_HTTP = new Set(['80', '8080', '8880', '2052', '2082', '2086', '2095']);

export default {
  /**
   * Main edge relay handler
   */
  async fetch(r, e, c) {
    try {
      const u = new URL(r.url);
      const p = u.pathname;

      // 1. Stealth Engine: Noise Filtering & Decoy
      if (p === '/' || F.has(p)) {
        return new Response(p === '/' ? D : null, {
          status: p === '/' ? 404 : 204,
          headers: { 'content-type': 'text/html', 'server': 'nginx' }
        });
      }

      const s = p.split('/').filter(Boolean);
      if (s.length < 2) return new Response(D, { status: 404, headers: { 'server': 'nginx' } });

      // 2. Dynamic Routing & Protocol Detection
      let i = 0;
      let t = 'https';

      if (s[0] === 'http' || s[0] === 'https') {
        t = s[0];
        i = 1;
      }

      const h_p = s[i];
      const t_p = '/' + s.slice(i + 1).join('/');
      const [h, o] = h_p.split(':');

      // Auto-detect protocol for raw IPs and non-TLS ports
      if (s[0] !== 'https') {
        const isIP = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(h);
        if (isIP || (o && P_HTTP.has(o))) {
          t = 'http';
        }
      }

      const dest = `${t}://${h_p}${t_p}${u.search}`;

      // 3. Header Sanitization
      const n = new Headers(r.headers);
      n.set('Host', h);
      H_IN.forEach(x => n.delete(x));

      // 4. Relay Configuration (Optimized for VoIP/Streaming)
      const cfg = {
        method: r.method,
        headers: n,
        redirect: 'manual',
        signal: r.signal,
        cf: { cacheTtl: 0, cacheEverything: false, mirage: false, polish: 'off' }
      };

      if (r.method !== 'GET' && r.method !== 'HEAD') {
        cfg.body = r.body;
      }

      // 5. Execution with Auto-Fallback
      let res = await fetch(dest, cfg);
      
      if (t === 'https' && (res.status >= 525 || res.status === 521)) {
        res = await fetch(dest.replace('https://', 'http://'), cfg);
      }

      // 6. WebSocket Direct Tunnel (Critical for Real-time Data)
      if (res.status === 101 || r.headers.get('Upgrade')?.toLowerCase() === 'websocket') {
        return res;
      }

      // 7. Response Masking (Double Stealth)
      const out = new Headers(res.headers);
      H_OUT.forEach(x => out.delete(x));
      
      out.set('Server', 'nginx');
      out.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      out.set('X-Content-Type-Options', 'nosniff');

      return new Response(res.body, {
        status: res.status,
        statusText: res.statusText,
        headers: out
      });

    } catch (err) {
      return new Response(null, { status: 499 });
    }
  }
};
