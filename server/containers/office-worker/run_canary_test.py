import urllib.request
import json

url = "https://filekit-office-worker-canary.voltframeagency.workers.dev/internal/canary/convert"
headers = {
    "Authorization": "Bearer filekit_canary_secret_2026",
    "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

with open("sample_canary.docx", "rb") as f:
    docx_bytes = f.read()

req = urllib.request.Request(url, data=docx_bytes, headers=headers, method="POST")

try:
    with urllib.request.urlopen(req) as response:
        status_code = response.status
        res_body = response.read().decode('utf-8')
        print(f"Status Code: {status_code}")
        print("Response Body:")
        print(res_body)
except urllib.error.HTTPError as e:
    print(f"HTTPError: {e.code}")
    print(e.read().decode('utf-8'))
