#!/usr/bin/env python3
"""
Simple server to save SVG files from the web interface
"""

from http.server import HTTPServer, SimpleHTTPRequestHandler
import json
import os
from datetime import datetime

class SVGHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_POST(self):
        if self.path == '/save-svg':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))

            svg_content = data.get('svg')
            seed = data.get('seed', 'unknown')

            # Create saved_svgs directory if it doesn't exist
            os.makedirs('saved_svgs', exist_ok=True)

            # Generate filename
            timestamp = datetime.now().strftime('%Y-%m-%dT%H-%M-%S')
            filename = f'saved_svgs/joy_division_seed{seed}_{timestamp}.svg'

            # Save file
            with open(filename, 'w') as f:
                f.write(svg_content)

            # Send response
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            response = json.dumps({'success': True, 'filename': filename})
            self.wfile.write(response.encode())

            print(f"Saved: {filename}")
        else:
            self.send_response(404)
            self.end_headers()

def run(port=8000):
    server_address = ('', port)
    httpd = HTTPServer(server_address, SVGHandler)
    print(f"Server running on http://localhost:{port}")
    print(f"Open http://localhost:{port}/joy_division_web.html in your browser")
    print(f"SVGs will be saved to: {os.path.abspath('saved_svgs')}")
    httpd.serve_forever()

if __name__ == '__main__':
    run()
