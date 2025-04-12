from fastapi import FastAPI
from typing import List


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
async def processVideo(filename: str, prompt: str):
    print(filename, prompt)
    return {"success": 1}

"""
chunkVideo(str: path_to_video) -> List:
- Returns list of absolute paths to 90 min video chunks - video_chunk dir
"""
def chunkVideo(path_to_video: str) -> List:
    # using ffmpeg, chunk a video into n min chunks
    n = 90 # 90 min chunks
    


@app.get("/")
async def root():
    return {"message": "OISJDOIFJSDIOFSJ"}

