from pymongo import MongoClient
from datetime import datetime

cluster = MongoClient("")

db = cluster["Soliloquy"]
collection = db["UserData"]

collection.insert_one({"_id":0, "user_name":"TestUser", "Summary": "test summary here ...", "Timestamp": datetime.now()})
print(collection.find_one())