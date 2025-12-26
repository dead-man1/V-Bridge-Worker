# V-Bridge-Worker 🚀
A high-performance, stealthy, and universal edge router built on Cloudflare Workers. Designed for low-latency data streaming and secure routing across edge networks.

## ✨ Key Features
- **Universal Routing:** Dynamically route traffic to any destination host and port via URL paths.
- **Zero-Latency Streaming:** Optimized for real-time data transfer with minimal overhead.
- **Double Stealth Engine:** Bi-directional header masking (Nginx spoofing) to remain invisible to active probing.
- **Request Efficiency:** Built-in noise filtering to preserve daily request limits.
- **Privacy Focused:** Automatically sanitizes sensitive headers to prevent tracking and IP leaks.
- **Full UDP Support:** Perfectly compatible with UDP encapsulation for high-quality voice/video calls and gaming.

## 🛠 Deployment
1. Create a new **Worker** in your Cloudflare dashboard.
2. Copy the content of `worker.js` from this repository.
3. Paste it into the Worker editor and click **Deploy**.

## 📖 Configuration Guide
Update your client (v2rayNG, Nekobox, etc.) with the following settings:

### 1. Connection Details
- **Address:** A clean Cloudflare IP (e.g., `www.speedtest.net`).
- **Request Host:** `your-worker.workers.dev`
- **SNI:** `your-worker.workers.dev`
- **TLS:** Enabled (for HTTPS ports) or Disabled (for HTTP ports).

### 2. Dynamic Path Format
The path structure is: `/{TARGET_HOST}:{PORT}/{ORIGINAL_PATH}`
- **Standard Port (443):** `/my-server.com/ws`
- **Custom Port (10002):** `/my-server.com:10002/ws`

### 3. Supported Ports
- **HTTPS (TLS ON):** `443, 2053, 2083, 2087, 2096, 8443`
- **HTTP (TLS OFF):** `80, 8080, 8880, 2052, 2082, 2086, 2095`

## 🔒 Security & Stealth
V-Bridge is designed to be invisible. Direct access to the Worker URL returns a standard **Nginx 404 Not Found** page. The source code is sanitized to ensure long-term stability and prevent automated detection by edge providers.

## License
[MIT](LICENSE)
