from fastapi import FastAPI
from typing import List
import os
import pathlib
from typing import List
from pymongo import MongoClient
from datetime import datetime
from datetime import timedelta
from ChromaUtils import vectorize, query_vector
from GeminiUtils import process_video, query, overall_summary
from moviepy.editor import VideoFileClip

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
def processVideo(filename: str, prompt: str):
    print("Process video endpoint hit")

    # get start and end time of video from metadata
    start_time = datetime.fromtimestamp(os.path.getctime(filename))
    clip = VideoFileClip(filename)
    end_time = start_time + timedelta(seconds=clip.duration)

    # generate log.txt file and read in log_content
    process_video(filename, 10)
    log_content = ""
    with open("log.txt", "r") as file:
        log_content = file.read()
    
    if len(log_content) == 0:
        return {"success": 0}
    
    # vectorize log content by chunks
    # split log content into chunks
    split_line = "----------------------------------------------------------------------------------------------------"

    start_time_delta = datetime.timedelta(hours=0, minutes=0, seconds=0)
    chunks = log_content.strip().split(split_line)

    for chunk in chunks:
        formatted_chunk = chunk.strip()
        if (len(formatted_chunk) == 0):
            continue
        duration_string = formatted_chunk.split("\n")[0]
        duration_string = duration_string.replace("length of video (", "").replace(")", "")

        parts = duration_string.split()
        hours = int(parts[0])
        minutes = int(parts[2])
        seconds = int(parts[4])

        # Create timedelta object - represents duration of chunk
        time_delta = datetime.timedelta(hours=hours, minutes=minutes, seconds=seconds)

        # Calculate start + end time of chunk
        chunk_start_time = start_time + start_time_delta
        chunk_end_time = chunk_start_time + time_delta

        vectorize(formatted_chunk, chunk_start_time, chunk_end_time)

        start_time_delta += time_delta

    log_summary = overall_summary(log_content)

    uploadMongo(log_summary, log_content, start_time, end_time)

    return {"success": 1}

"""
Post - /api/queryVideo
Params -  {query: “Where did i lose my phone???”}
Returns {"response": “You lost your phone …”}
"""
@app.post("/api/queryVideo")
async def queryVideo(query_string: str):
    return {"response": query(query_string)}

"""
uploadMongo(summary: str, log_content:str, start_time: datetime, end_time: datetime):
- Summary: summary of the video 
- Vectorizes each summary
- Uploads summary and vectorized data to mongoDB
"""

def uploadMongo(summary: str, log_content: str, start_time: datetime, end_time: datetime):
    try:
        #vectorize(log_content, start_time, end_time)
        ret = collection.insert_one({"user_name": db_username, "Log": log_content, "Summary": summary, "Start_Time": start_time, "End_Time": end_time})
        print(ret.inserted_id)
        return {"id": ret.inserted_id}
    except:
        return {"id": -1}
    

@app.get("/")
async def root():
    return {"message": "OISJDOIFJSDIOFSJ"}
