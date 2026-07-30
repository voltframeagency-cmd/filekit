import http.client
import sys

routes_to_test = [
    '/word-to-pdf',
    '/excel-to-pdf',
    '/ocr-pdf',
    '/pdf-to-word',
    '/heic-to-jpg',
]

print("Executing Production HTTP Status Verification for Planned Routes...")

try:
    conn = http.client.HTTPConnection("localhost", 3000, timeout=5)
    
    for route in routes_to_test:
        conn.request("GET", route)
        res = conn.getresponse()
        body = res.read().decode('utf-8', errors='ignore')
        
        has_noindex = 'noindex' in body or 'robots' in body
        print(f"  Route: {route:<22} Status: {res.status} {res.reason:<12} Robots/Noindex: {has_noindex}")
        
    conn.close()
    print("Verification pass completed.")
except Exception as e:
    print(f"Server connection warning (Make sure localhost:3000 is running): {e}")
