"""
Secure Secret Rotation Script
Generates cryptographically secure 256-bit entropy secrets, pipes them directly to Wrangler,
and stores them ONLY in memory / private local file.
"""

import subprocess
import secrets
import time
import os

def main():
    b_secret = secrets.token_hex(32)
    a_secret = secrets.token_hex(32)

    print("Executing CANARY_BEARER_TOKEN rotation...")
    p1 = subprocess.Popen("npx wrangler secret put CANARY_BEARER_TOKEN", stdin=subprocess.PIPE, text=True, shell=True)
    p1.communicate(b_secret + "\n")
    time.sleep(3)

    print("Executing CANARY_ADMIN_SECRET rotation...")
    p2 = subprocess.Popen("npx wrangler secret put CANARY_ADMIN_SECRET", stdin=subprocess.PIPE, text=True, shell=True)
    p2.communicate(a_secret + "\n")
    time.sleep(3)

    # Save to local private module for automated runner consumption
    with open("_sec_store.py", "w") as f:
        f.write(f'BEARER_TOKEN = "{b_secret}"\nADMIN_SECRET = "{a_secret}"\n')

    print("Secret rotation completed successfully.")

if __name__ == "__main__":
    main()
