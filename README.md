# V-Bridge Worker 🚀
A high-performance, stealthy, and universal reverse proxy built on Cloudflare Workers for WebSocket-based protocols (VLESS/VMess).

## 🌟 Features
- **Universal Routing:** Proxy any target host dynamically via the URL path without modifying the code.
- **Stealth Mode:** Built-in Nginx-style **404 Not Found** decoy page to bypass active probing and scanners.
- **Privacy Focused:** Automatically strips sensitive Cloudflare headers (like `cf-connecting-ip`) to increase anonymity.
- **WebSocket & UDP:** Full support for VLESS/VMess over WebSocket, including UDP encapsulation for Voice calls and Gaming.

## 🛠 Deployment
1. Log in to your **Cloudflare Dashboard**.
2. Go to **Workers & Pages** and create a new Worker.
3. Copy the content of `worker.js` from this repository.
4. Paste it into the Worker editor, then click **Save and Deploy**.

## 📖 How to Use
To use this worker, you need to modify your VLESS/VMess client configuration (v2rayNG, Nekobox, etc.) as follows:

- **Address:** Use a clean Cloudflare IP or a CDN-friendly domain (e.g., `www.speedtest.net` or `discord.com`).
- **Port:** `443`
- **Request Host:** `your-worker-name.your-subdomain.workers.dev`
- **SNI:** `your-worker-name.your-subdomain.workers.dev`
- **Path:** `/{TARGET_HOST}/{ORIGINAL_PATH}`
  - *Example:* If your server is `de-full.privateip.net` and the path is `/ws`, your new path will be: `/de-full.privateip.net/ws`
- **TLS:** Enabled (ON)
- **Fingerprint:** `chrome` or `random`

## 🔒 Security & Stealth
This worker is designed to be invisible. If anyone (or any automated scanner) visits your Worker URL directly without the correct path format, they will be greeted with a standard **Nginx 404 Not Found** page. This hides the fact that the URL is being used as a proxy bridge.

## 📄 License
This project is licensed under the [MIT License](LICENSE).
