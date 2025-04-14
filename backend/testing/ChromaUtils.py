import chromadb
from datetime import datetime
import uuid, os

# Chroma DB Setup
client = chromadb.Client()

CHROMA_DATA_PATH = "chroma_data/"
COLLECTION_NAME = "shit"

client = chromadb.PersistentClient(path=CHROMA_DATA_PATH)

collection = client.get_or_create_collection(
    name=COLLECTION_NAME,
    metadata={"hnsw:space": "cosine", 
    "hnsw:num_threads": 1},
)

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
        ids=[str(uuid.uuid4())],
        metadatas=[{"start_time": start_time.strftime("%Y-%m-%d %H:%M:%S"), "end_time": end_time.strftime("%Y-%m-%d %H:%M:%S")}],
    )

"""
Queries local chroma db collection
Params: 
    query: string
    n_results: int

Returns dict of documents and timestamps
{"documents": [[document1], [document2], ...], "metadatas": [{"start_time": start_time, "end_time": end_time}, {"start_time": start_time, "end_time": end_time}, ...]}
Timestamps are datetime objects
"""
def query_vector(query: str, n_results: int = 1):
    query_results = collection.query(
        query_texts=[query],
        n_results=n_results,
    )

    # Convert timestamps to datetime objects
    datetimes = []
    #print(query_results["metadatas"])
    for val in query_results["metadatas"]:
        for dict in val:
            if dict is None:
                continue
            time_dict = {}
            time_dict["start_time"] = datetime.strptime(dict["start_time"], "%Y-%m-%d %H:%M:%S")
            time_dict["end_time"] = datetime.strptime(dict["end_time"], "%Y-%m-%d %H:%M:%S")
            datetimes.append(time_dict)


    return {"documents": query_results["documents"], "metadatas": datetimes}

if __name__ == "__main__":
    #vectorize("I like hamburgers", datetime.now(), datetime.now())
    #vectorize("I like dogs", datetime.now(), datetime.now())
    print(query_vector("Who is the sideline reporter?", 2))
