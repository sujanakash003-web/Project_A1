#!/usr/bin/env python3
"""
Project A1 - Co-Founder Operating System Local & Network Server
Launches the web application on http://localhost:8000, enables network access
for other devices (Mac, iPad, iPhone, Android), and provides live shared state sync.
"""

import os
import sys
import json
import socket
import webbrowser
import threading
import time
from http.server import HTTPServer, SimpleHTTPRequestHandler

PORT = int(os.environ.get("PORT", 8000))
DIRECTORY = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(DIRECTORY, "data.json")

def get_local_ip():
    """Detect the local Wi-Fi / LAN IP address for cross-device access."""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(('8.8.8.8', 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        try:
            return socket.gethostbyname(socket.gethostname())
        except Exception:
            return '127.0.0.1'

class ProjectA1Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        if self.path == '/api/state':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            if os.path.exists(DATA_FILE):
                with open(DATA_FILE, 'r', encoding='utf-8') as f:
                    self.wfile.write(f.read().encode('utf-8'))
            else:
                self.wfile.write(b"{}")
            return
        elif self.path == '/api/network-info':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            info = {
                "local_ip": get_local_ip(),
                "port": PORT,
                "network_url": f"http://{get_local_ip()}:{PORT}"
            }
            self.wfile.write(json.dumps(info).encode('utf-8'))
            return
        
        super().do_GET()

    def do_POST(self):
        if self.path == '/api/state':
            try:
                content_length = int(self.headers.get('Content-Length', 0))
                body = self.rfile.read(content_length).decode('utf-8')
                # Validate JSON
                parsed = json.loads(body)
                with open(DATA_FILE, 'w', encoding='utf-8') as f:
                    json.dump(parsed, f, indent=2)
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "saved", "timestamp": time.time()}).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))
            return

        super().do_POST()

def open_browser():
    # Only open browser window on interactive local machines
    if os.environ.get("RENDER") or os.environ.get("RAILWAY_ENVIRONMENT") or (os.environ.get("PORT") and os.environ.get("PORT") != "8000"):
        return
    try:
        time.sleep(1.2)
        url = f"http://localhost:{PORT}"
        print(f"[Project A1] Opening browser at {url}...")
        webbrowser.open(url)
    except Exception:
        pass

def main():
    os.chdir(DIRECTORY)
    server_address = ('0.0.0.0', PORT)
    httpd = HTTPServer(server_address, ProjectA1Handler)
    local_ip = get_local_ip()
    
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

    print("=" * 70)
    print("  PROJECT A1 -- CO-FOUNDER DEVELOPMENT OPERATING SYSTEM")
    print("=" * 70)
    print(f"  [1] THIS DEVICE (Local):    http://localhost:{PORT}")
    print(f"  [2] OTHER DEVICES (Mac/Phone on same Wi-Fi):")
    print(f"      ->  http://{local_ip}:{PORT}")
    print("=" * 70)
    print("  Co-Founders:")
    print("    - Milan Jadhav")
    print("    - Sujan Akash")
    print("  Multi-device state synchronization is ACTIVE via /api/state.")
    print("  Press Ctrl+C to terminate server.")
    print("=" * 70)

    # Automatically open local browser
    threading.Thread(target=open_browser, daemon=True).start()
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[Project A1] Server stopped gracefully.")
        sys.exit(0)

if __name__ == '__main__':
    main()
