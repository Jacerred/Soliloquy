from fastapi import FastAPI
import os
import pathlib
from typing import List, Annotated
from pymongo import MongoClient
from datetime import datetime
from datetime import timedelta
from ChromaUtils import vectorize, query_vector
from GeminiUtils import process_video, query, overall_summary, query_with_db
from moviepy.editor import VideoFileClip
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi import FastAPI, Form


app = FastAPI()
# I hate CORS
origins = [
    "http://localhost",
    "http://127.0.0.1:3000",
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],    
)

# MongoDB Credentials ----------------------------------------------------------
cluster = MongoClient("mongodb+srv://jasonxwanggg9:RJozaS4Ahx91CbYd@cluster0.jcbj8gl.mongodb.net/?retryWrites=true&w=majority")

db = cluster["Soliloquy"]
collection = db["UserData"]
db_username = "TestUser"

# Video Processing directories --------------------------------------------------
base_dir = pathlib.Path(__file__).parent.resolve()
chunk_base_dir = f"{base_dir}\\video_chunks"


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
def processVideo(filename: Annotated[str, Form()]):
    print("Process video endpoint hit")


    # get start and end time of video from metadata
    start_time = datetime.fromtimestamp(os.path.getctime(filename))
    clip = VideoFileClip(filename)
    end_time = start_time + timedelta(seconds=clip.duration)

    # generate log.txt file and read in log_content
    process_video(filename, 90)
    log_content = ""
    with open("log.txt", "r") as file:
        log_content = file.read()
    
    if len(log_content) == 0:
        return {"success": 0}
    
    # vectorize log content by chunks
    # split log content into chunks
    split_line = "----------------------------------------------------------------------------------------------------"

    start_time_delta = timedelta(hours=0, minutes=0, seconds=0)
    chunks = log_content.strip().split(split_line)

    for chunk in chunks:
        formatted_chunk = chunk.strip()
        if (len(formatted_chunk) == 0):
            continue

        try: 
            duration_string = formatted_chunk.split("\n")[0]
            duration_string = duration_string.replace("length of video (", "").replace(")", "")

            parts = duration_string.split()
            hours = int(parts[0])
            minutes = int(parts[2])
            seconds = int(parts[4])

            # Create timedelta object - represents duration of chunk
            time_delta = timedelta(hours=hours, minutes=minutes, seconds=seconds)

            # Calculate start + end time of chunk
            chunk_start_time = start_time + start_time_delta
            chunk_end_time = chunk_start_time + time_delta

            vectorize(formatted_chunk, chunk_start_time, chunk_end_time)

            start_time_delta += time_delta
        except:
            continue

    log_summary = overall_summary(log_content)

    uploadMongo(log_summary, log_content, start_time, end_time)

    # delete log.txt file
    os.remove(f"{base_dir}\\log.txt")

    return {"success": 1}

"""
Get dict from mongoDB
Params
- username: username of the user
- timestamp: datetime object representing the day
"""
def fetchMongoDay(username: str, timestamp: datetime):
    # fetch all with same username
    for x in collection.find({"user_name": username}):
        # compare the day and not the time
        if x["Start_Time"].date() == timestamp.date():
            return x

"""
Post - /api/getJournal
Params - form data with date in format YYYY-MM-DD
Returns - {"response": "Summary of the day"}
"""
@app.post("/api/getJournal")
async def getJournal(date: Annotated[str, Form()]):
    print("Get journal endpoint hit")

    date = datetime.strptime(date, "%Y-%m-%d")
    content = fetchMongoDay(db_username, date)["Summary"]

    return {"response": content}

"""
Post - /api/queryVideo
Params -  {query: “Where did i lose my phone???”}
Returns {"response": “You lost your phone …”}
"""
@app.post("/api/queryVideo")
async def queryVideo(prompt: Annotated[str, Form()]):
    print("Query video endpoint hit")

    # get log_content from mongoDB
    log_content = fetchMongoDay(db_username, datetime.now())["Log"]

    return {"response": query(prompt, log_content)}

"""
Post - /api/queryVideo
Params -  {query: “Where did i lose my phone???”}
Returns {"response": “You lost your phone …”}
"""
@app.post("/api/queryVideo")
async def queryVideo(prompt: Annotated[str, Form()]):
    print("Query video endpoint hit")

    # get log_content from mongoDB
    log_content = fetchMongoDay(db_username, datetime.now())["Log"]

    return {"response": query(prompt, log_content)}

"""
Query whole journal flow:
- Query vector DB and get top few chunks
- Call whole journal query func
"""
@app.post("/api/queryJournal")
async def queryJournal(prompt: Annotated[str, Form()]):
    print("Query journal endpoint hit")

    # call whole journal query func
    db_output = query_vector(prompt, 5)
    response = query_with_db(db_output, prompt)

    return {"response": response}

"""
Get all dates of a username
Returns
{
  "dates": [
    "2025-04-12",
    "2025-04-13"
  ]
}
"""
@app.get("/api/getDates")
async def getDates():
    print("Get dates endpoint hit")

    dates = []
    for x in collection.find({"user_name": db_username}):
        dates.append(x["Start_Time"].date())
    
    print(dates)

    return {"dates": dates}


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
