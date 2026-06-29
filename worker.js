/**
 * V-Bridge-Worker v2.0
 * High-performance edge data relay.
 * Optimized for connection persistence and resource efficiency.
 */

const D = `<html><head><title>404 Not Found</title></head><body><center><h1>404 Not Found</h1></center><hr><center>nginx</center></body></html>`;
const F = new Set(['/favicon.ico', '/robots.txt', '/.env', '/.git', '/.well-known']);
const H_IN = ['cf-connecting-ip', 'cf-ipcountry', 'cf-ray', 'cf-visitor', 'x-forwarded-for', 'x-real-ip', 'forwarded', 'sec-ch-ua', 'sec-ch-ua-mobile', 'sec-ch-ua-platform'];
const H_OUT = ['cf-ray', 'alt-svc', 'cf-cache-status', 'x-powered-by', 'x-cloudflare-request-id'];
const P_HTTP = new Set(['80', '8080', '8880', '2052', '2082', '2086', '2095']);

export default {
  async fetch(r) {
    try {
      const u = new URL(r.url);
      const p = u.pathname;

      // 1. Resource Preservation (Save 100k limit)
      if (p === '/' || F.has(p)) {
        return new Response(p === '/' ? D : null, {
          status: p === '/' ? 404 : 204,
          headers: { 'content-type': 'text/html; charset=UTF-8', 'server': 'nginx', 'connection': 'close' }
        });
      }

      const s = p.split('/').filter(Boolean);
      if (s.length < 2) return new Response(D, { status: 404, headers: { 'server': 'nginx' } });

      // 2. Smart Routing & Protocol Detection
      let i = 0;
      let t = 'https';
      if (s[0] === 'http' || s[0] === 'https') { t = s[0]; i = 1; }

      const h_p = s[i];
      const t_p = '/' + s.slice(i + 1).join('/');
      const [h, o] = h_p.split(':');

      // Pre-emptive Protocol Logic: If port is HTTP-only or it's a raw IP, default to http
      if (s[0] !== 'https') {
        const isIP = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(h);
        if (isIP || (o && P_HTTP.has(o))) {
          t = 'http';
        }
      }

      const dest = `${t}://${h_p}${t_p}${u.search}`;

      // 3. Header Management
      const n = new Headers(r.headers);
      n.set('Host', h);
      n.set('Connection', 'keep-alive');
      for (const x of H_IN) n.delete(x);

      // 4. Fetch Configuration
      const cfg = {
        method: r.method,
        headers: n,
        redirect: 'manual'
      };
      
      if (r.signal) cfg['signal'] = r.signal;
      cfg['cf'] = { cacheTtl: 0, cacheEverything: false, mirage: false, polish: 'off' };

      if (r.method !== 'GET' && r.method !== 'HEAD') cfg.body = r.body;

      // 5. Execution with Smart Fallback
      let res;
      try {
        res = await fetch(dest, cfg);
        // If HTTPS fails on non-standard ports, try plain HTTP immediately
        if (t === 'https' && (res.status === 525 || res.status === 521 || res.status === 526)) {
          throw new Error();
        }
      } catch (e) {
        res = await fetch(dest.replace('https://', 'http://'), cfg);
      }

      // 6. Direct Pipe for WebSocket/VoIP (Zero-Latency)
      if (res.status === 101 || r.headers.get('Upgrade')?.toLowerCase() === 'websocket') {
        return res;
      }

      // 7. Response Masking (Stealth Engine)
      const out = new Headers(res.headers);
      for (const x of H_OUT) out.delete(x);
      
      out.set('Server', 'nginx');
      out.set('Cache-Control', 'no-store, no-cache, must-revalidate');
      out.set('X-Content-Type-Options', 'nosniff');

      return new Response(res.body, { status: res.status, headers: out });

    } catch (e) {
      return new Response(null, { status: 499 });
    }
  }
};
