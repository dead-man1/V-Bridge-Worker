# V-Bridge Worker 🚀
A high-performance, stealthy, and universal reverse proxy built on Cloudflare Workers. Specifically designed to bypass heavy network restrictions and censorship for VLESS and VMess protocols.

## ✨ Key Features
- **Universal Port Support:** Proxy any target host on any port (e.g., `domain.com:10002`).
- **Stealth Engine:** Built-in Nginx-style **404 Not Found** decoy page to protect against active probing and GFW scanners.
- **Privacy Focused:** Automatically strips sensitive Cloudflare headers to increase anonymity and prevent IP leaks.
- **Low Latency:** Optimized code for minimal overhead, ensuring the best possible ping for gaming and voice calls.
- **Full UDP Support:** Compatible with UDP encapsulation for Telegram Voice, WhatsApp, and online gaming.
- **Multi-Port Compatibility:** Works with all Cloudflare-supported HTTP and HTTPS ports.

## 🛠 Deployment
1. Create a new **Worker** in your Cloudflare dashboard.
2. Copy the content of `worker.js` from this repository.
3. Paste it into the Worker editor and click **Deploy**.

## 📖 Configuration Guide (v2rayNG, Nekobox, etc.)
To use this worker, modify your VLESS/VMess client settings as follows:

### 1. Connection Settings
- **Address:** A clean Cloudflare IP (e.g., `www.speedtest.net` or a custom clean IP for your ISP).
- **Request Host:** `your-worker.workers.dev`
- **SNI:** `your-worker.workers.dev`
- **TLS:** Enabled (for HTTPS ports) or Disabled (for HTTP ports).

### 2. Dynamic Path Format
The path must follow this structure: `/{TARGET_HOST}:{PORT}/{ORIGINAL_PATH}`

- **Standard Port (443):** `/my-server.com/ws`
- **Custom Port (10002):** `/my-server.com:10002/ws`

### 3. Supported Cloudflare Ports
You can use any of these ports in your client:
- **HTTPS (TLS ON):** `443, 2053, 2083, 2087, 2096, 8443`
- **HTTP (TLS OFF):** `80, 8080, 8880, 2052, 2082, 2086, 2095`

## 🔒 Security & Stealth
This worker is designed to be invisible. If anyone visits your Worker URL directly without the correct path format, they will see a standard **Nginx 404 Not Found** page. This hides the proxy's existence from unauthorized users and automated scanners.

## License
[MIT](LICENSE)
