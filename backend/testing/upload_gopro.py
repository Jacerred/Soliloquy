
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
from dotenv import load_dotenv

# MongoDB Credentials ----------------------------------------------------------
load_dotenv()
cluster = MongoClient(os.getenv("MONGO_URI"))

db = cluster["Soliloquy"]
collection = db["UserData"]
db_username = "TestUser"

# Video Processing directories --------------------------------------------------
base_dir = pathlib.Path(__file__).parent.resolve()
chunk_base_dir = f"{base_dir}\\video_chunks"


"""
uploadMongo(summary: str, log_content:str, start_time: datetime, end_time: datetime):
- Summary: summary of the video 
- Vectorizes each summary
- Uploads summary and vectorized data to mongoDB
"""

def uploadMongo(summary: str, log_content: str, start_time: datetime, end_time: datetime, filename: str):
    try:
        #vectorize(log_content, start_time, end_time)
        ret = collection.insert_one({"user_name": db_username, "Log": log_content, "Summary": summary, "Start_Time": start_time, "End_Time": end_time, "filename": filename})
        print(ret.inserted_id)
        return {"id": ret.inserted_id}
    except:
        return {"id": -1}
    


"""
UPload all gopro videos in directory and forge timestamps so each is one day
"""

delta_day = timedelta(days=1)

if __name__ == "__main__":
    # get all files in a directory
    start_time = datetime(2025, 1, 1)
    print(os.listdir("gopro"))
    for file in os.listdir("gopro"):
        if len(file) == 0:
            continue

        start_time += delta_day

        if (start_time < datetime(2025, 1, 15)):
            continue
        

        clip = VideoFileClip(f"gopro\\{file}")
        end_time = start_time + timedelta(seconds=clip.duration)
        filename = f"{base_dir}\\gopro\\{file}"
        print(f"Processing {filename} --------------------------------------------------------------")
        # generate log.txt file and read in log_content
        process_video(filename, 90)
        log_content = ""
        with open("log.txt", "r") as file:
            log_content = file.read()
        
        
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

        uploadMongo(log_summary, log_content, start_time, end_time, filename)

        # delete log.txt file
        os.remove(f"{base_dir}\\log.txt")
