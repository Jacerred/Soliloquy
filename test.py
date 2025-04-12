import datetime
from ChromaUtils import vectorize
from GeminiUtils import overall_summary
from pymongo import MongoClient

# MongoDB Credentials ----------------------------------------------------------
cluster = MongoClient("mongodb+srv://jasonxwanggg9:RJozaS4Ahx91CbYd@cluster0.jcbj8gl.mongodb.net/?retryWrites=true&w=majority")

db = cluster["Soliloquy"]
collection = db["UserData"]
db_username = "TestUser"

"""
Get dict from mongoDB
Params
- username: username of the user
- timestamp: datetime object representing the day
"""
def fetchMongoDay(username: str, timestamp: datetime.datetime):
    # fetch all with same username
    for x in collection.find({"user_name": username}):
        # compare the day and not the time
        if x["Start_Time"].date() == timestamp.date():
            return x

print(fetchMongoDay("TestUser", datetime.datetime.now()))
