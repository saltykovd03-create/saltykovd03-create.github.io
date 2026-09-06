#!/usr/bin/env python3
"""Локальный предпросмотр: python3 serve.py [порт]. Отдаёт папку сайта, без кэша."""
import http.server, sys
from pathlib import Path
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8031
ROOT = Path(__file__).parent
class H(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw): super().__init__(*a, directory=str(ROOT), **kw)
    def end_headers(self):
        self.send_header("Cache-Control", "no-store"); super().end_headers()
    def log_message(self, *a): pass
http.server.ThreadingHTTPServer(("127.0.0.1", PORT), H).serve_forever()
