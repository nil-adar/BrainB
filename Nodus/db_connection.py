import pymongo
import os

db_id = os.environ.get('DATABASE_USERNAME')
db_pwd = os.environ.get('DATABASE_PWD')
url = 'mongodb+srv://bish150b:XWMy2SRuyRaDIAIK@cluster0.g4t9j0f.mongodb.net/'
client = pymongo.MongoClient(url)

db = client['adhd']

