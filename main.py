from fastapi import FastAPI
from typing import List
import os
import pathlib
from typing import List
from pymongo import MongoClient
from datetime import datetime
import chromadb

# Chroma DB Setup ------------------------------------------------------------
client = chromadb.Client()

CHROMA_DATA_PATH = "chroma_data/"
COLLECTION_NAME = "shit"

client = chromadb.PersistentClient(path=CHROMA_DATA_PATH)

collection = client.get_or_create_collection(
    name=COLLECTION_NAME,
    metadata={"hnsw:space": "cosine"},
)


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
Saves text to local chroma db collection
Params: 
    documents: one paragraph of text - e.g. summary of one hour chunk
    start_time: datetime of start of chunk
    end_time: datetime of end of chunk
"""
def vectorize(document: str, start_time: datetime, end_time: datetime):
    collection.add(
        documents=[document],
        metadatas=[{"start_time": start_time, "end_time": end_time}],
    )

"""
Queries local chroma db collection
Params: 
    query: string
    n_results: int

Returns list of list of strings
[[document1], [document2], ...]
"""
def query_vector(query: str, n_results: int = 1):
    query_results = collection.query(
        query_texts=[query],
        n_results=n_results,
    )

    return query_results["documents"]

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
    return {"success": 1}

"""
chunkVideo(str: path_to_video) -> List:
- Returns list of absolute paths to 90 min video chunks - video_chunk dir
"""
def chunkVideo(path_to_video: str, chunk_seconds: int = 10*60) -> List:
    video_name = os.path.basename(path_to_video)
    path_to_video = f"{base_dir}\\{path_to_video}"

    try:
        # create dir for chunks of specific video
        os.mkdir(f"{chunk_base_dir}\\{video_name}")

        # using ffmpeg, chunk a video into n min chunks
        cmd = f"{base_dir}\\ffmpeg -i {path_to_video} -threads 3 \
            -vcodec copy -f segment -segment_time {chunk_seconds} \
            -reset_timestamps 1 \
            {chunk_base_dir}\\{video_name}\\{video_name}_cam_out_h264_%02d.mp4"

        os.system(cmd)

        return os.listdir(f"{chunk_base_dir}\\{video_name}")
    except:
        return []

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

