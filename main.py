from fastapi import FastAPI
from typing import List
import os
import pathlib
from typing import List
from pymongo import MongoClient
from datetime import datetime
from ChromaUtils import vectorize, query_vector

# MongoDB Credentials ----------------------------------------------------------
cluster = MongoClient("mongodb+srv://jasonxwanggg9:RJozaS4Ahx91CbYd@cluster0.jcbj8gl.mongodb.net/?retryWrites=true&w=majority")

db = cluster["Soliloquy"]
collection = db["UserData"]
db_username = "TestUser"

# Video Processing directories --------------------------------------------------
base_dir = pathlib.Path(__file__).parent.resolve()
chunk_base_dir = f"{base_dir}\\video_chunks"


app = FastAPI()

"""
Requests: - no auth
Post - /api/processVideo
Params -  {filename: “path to file”, prompt: “prompt here”}

processVideo(json params)
- Post request handler
- Chunks video using chunk video func
- Sends each chunk to gemini api saves summaries
- Uses uploadMongo func to upload to mongo
- Returns on success
"""

@app.post("/api/processVideo")
async def processVideo(filename: str, prompt: str, start_time: datetime, end_time: datetime):
    print(filename, prompt)
    uploadMongo(prompt, start_time, end_time)
    return {"success": 1}


"""
uploadMongo(summary: str, timestamp: datetime):
- Vectorizes each summary
- Uploads summary and vectorized data to mongoDB
"""

def uploadMongo(summary: str, start_time: datetime, end_time: datetime):
    try:
        vectorize(summary, start_time, end_time)
        ret = collection.insert_one({"user_name": db_username, "Summary": summary, "Start_Time": start_time, "End_Time": end_time})
        print(ret.inserted_id)
        return {"id": ret.inserted_id}
    except:
        return {"id": -1}
    

@app.get("/")
async def root():
    return {"message": "OISJDOIFJSDIOFSJ"}
