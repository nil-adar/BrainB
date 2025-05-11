import os
from pymongo import MongoClient
from dotenv import load_dotenv


load_dotenv(dotenv_path=r"C:\Users\nilad\BrainB\.env")



MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    raise Exception(" MONGO_URI is missing in environment variables!")

# חיבור למסד הנתונים
client = MongoClient(MONGO_URI)
db = client["BrainB"]  # זה שם הדאטאבייס המרכזי שלך

# אוסף שבו נשמור את תוצאות האבחון
diagnosis_results_collection = db["diagnosis_results"]

print("✅ Connected successfully to BrainBridge database.")
