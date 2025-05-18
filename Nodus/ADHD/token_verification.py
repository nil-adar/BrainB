# token_verification.py

import requests
from django.http import JsonResponse

# כתובת ה-API של BrainBridge
VERIFY_API_URL = "http://localhost:5000/api/diagnostic/verify"

def verify_token(token):
    try:
        response = requests.post(VERIFY_API_URL, json={"token": token})
        if response.status_code == 200:
            return True, response.json().get("studentId")
        else:
            return False, None
    except Exception as e:
        print("Token verification failed:", e)
        return False, None
