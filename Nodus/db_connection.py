import pymongo
import os

db_id = os.environ.get('DATABASE_USERNAME')
db_pwd = os.environ.get('DATABASE_PWD')
url = 'mongodb+srv://bish150b:XWMy2SRuyRaDIAIK@cluster0.g4t9j0f.mongodb.net/'
client = pymongo.MongoClient(url)

db = client['adhd']

# חיבור למסד של BrainBridge 
brainb_url = 'mongodb+srv://niladar:RX1DRQF36Rsavqgx@schoolsdata.yg5ih.mongodb.net/BrainB'  
brainb_client = pymongo.MongoClient(brainb_url)
brainb_db = brainb_client['BrainB']

# קולקשן  BrainBridge
brainb_tokens = brainb_db['diagnosticTokens']
brainb_users = brainb_db['users']

