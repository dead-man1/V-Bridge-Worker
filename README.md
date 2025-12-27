# V-Bridge-Worker 🚀

A high-performance, stealthy, and universal edge data relay built on Cloudflare Workers. Optimized for low-latency streaming, bi-directional masking, and secure traffic management.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Platform: Cloudflare Workers](https://img.shields.io/badge/Platform-Cloudflare_Workers-orange.svg)](https://workers.cloudflare.com/)

## ✨ Key Features

- **Universal Routing:** Dynamically relay traffic to any destination host and port via URL paths.
- **Auto-Protocol Fallback:** Intelligent fallback from HTTPS to HTTP for targets without SSL certificates.
- **Zero-Latency Streaming:** Optimized for real-time data transfer (WebSocket) with no buffering.
- **Double Stealth Engine:** Bi-directional header masking (Nginx spoofing) to remain invisible to active probing.
- **Request Efficiency:** Built-in noise filtering (Favicon, Bots) to preserve your daily 100k request limits.
- **Privacy Focused:** Automatically sanitizes sensitive headers to prevent tracking and IP leaks.
- **Full UDP Support:** Perfectly compatible with UDP encapsulation for high-quality voice/video calls and gaming.

## 🛠 Deployment

1.  Log in to your **Cloudflare Dashboard**.
2.  Go to **Workers & Pages** and create a new Worker named `v-bridge-worker`.
3.  Copy the content of `worker.js` from this repository.
4.  Paste it into the Worker editor and click **Deploy**.

## 📖 Configuration Guide

Update your client (v2rayNG, Nekobox, etc.) with the following settings:

### 1. Connection Details
- **Address:** A clean Cloudflare IP (e.g., `www.speedtest.net`).
- **Port:** `443` (Recommended) or any supported Cloudflare port.
- **Request Host:** `your-worker-name.your-subdomain.workers.dev`
- **SNI:** `your-worker-name.your-subdomain.workers.dev`
- **TLS:** Enabled (for HTTPS ports) or Disabled (for HTTP ports).

### 2. Dynamic Path Format
The path structure is: `/{TARGET_HOST}:{PORT}/{ORIGINAL_PATH}`

- **Standard Port (443):** `/my-server.com/ws`
- **Custom Port (10002):** `/my-server.com:10002/ws`
- **Auto-Fallback:** If the target lacks SSL, the relay automatically switches to HTTP.

### 3. Supported Cloudflare Ports
- **HTTPS (TLS ON):** `443, 2053, 2083, 2087, 2096, 8443`
- **HTTP (TLS OFF):** `80, 8080, 8880, 2052, 2082, 2086, 2095`

## 🔒 Security & Stealth

V-Bridge-Worker is designed to be invisible. 
- **Decoy Mode:** Direct access to the Worker URL returns a standard **Nginx 404 Not Found** page.
- **Header Masking:** All Cloudflare-specific fingerprints are stripped from both requests and responses, mimicking a standalone Nginx server.
- **Sanitized Code:** No sensitive keywords are used in the source code to ensure long-term stability.

## 📄 License

This project is licensed under the [MIT License](LICENSE).
