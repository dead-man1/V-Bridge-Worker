# V-Bridge Worker 🚀
A high-performance, stealthy, and universal reverse proxy built on Cloudflare Workers for WebSocket-based protocols (VLESS/VMess).

## 🌟 Features
- **Universal Routing:** Proxy any target host dynamically via the URL path without modifying the code.
- **Stealth Mode:** Built-in Nginx-style **404 Not Found** decoy page to bypass active probing.
- **Privacy Focused:** Automatically strips sensitive Cloudflare headers to increase anonymity.
- **WebSocket & UDP:** Full support for VLESS/VMess over WebSocket, including UDP encapsulation for Voice calls and Gaming.
- **Multi-Port Support:** Compatible with all Cloudflare-supported HTTP and HTTPS ports.

## 🛠 Deployment
1. Log in to your **Cloudflare Dashboard**.
2. Go to **Workers & Pages** and create a new Worker.
3. Copy the content of `worker.js` from this repository.
4. Paste it into the Worker editor, then click **Save and Deploy**.

## 📖 How to Use
Modify your VLESS/VMess client configuration (v2rayNG, Nekobox, etc.) as follows:

### 1. Connection Settings
- **Address:** Use a clean Cloudflare IP or a CDN-friendly domain (e.g., `www.speedtest.net`).
- **Request Host:** `your-worker-name.your-subdomain.workers.dev`
- **SNI:** `your-worker-name.your-subdomain.workers.dev`
- **Path:** `/{TARGET_HOST}/{ORIGINAL_PATH}`
  - *Example:* If your target server is `my-secret-server.com` and the path is `/graphql`, your new path will be: `/my-secret-server.com/graphql`

### 2. Port & TLS Options
This worker supports all standard Cloudflare ports. Choose based on your needs:

#### **HTTPS (TLS Enabled)**
Recommended for security. Use these ports with **TLS ON**:
`443, 2053, 2083, 2087, 2096, 8443`

#### **HTTP (TLS Disabled)**
Use these ports with **TLS OFF**:
`80, 8080, 8880, 2052, 2082, 2086, 2095`

## 🔒 Security & Stealth
This worker is designed to be invisible. If anyone visits your Worker URL directly without the correct path format, they will see a standard **Nginx 404 Not Found** page. This hides the proxy's existence from scanners and unauthorized users.

## 📄 License
This project is licensed under the [MIT License](LICENSE).
