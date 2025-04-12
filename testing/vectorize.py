import chromadb
from datetime import datetime

# Chroma DB Setup
client = chromadb.Client()

CHROMA_DATA_PATH = "chroma_data/"
COLLECTION_NAME = "shit"

client = chromadb.PersistentClient(path=CHROMA_DATA_PATH)

collection = client.get_or_create_collection(
    name=COLLECTION_NAME,
    metadata={"hnsw:space": "cosine"},
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
        metadatas=[{"start_time": start_time, "end_time": end_time}],
    )

"""
Queries local chroma db collection
Params: 
    query: string
    n_results: int

Returns dict of documents and m
{"documents": [[document1], [document2], ...], "metadatas": [{"start_time": start_time, "end_time": end_time}, {"start_time": start_time, "end_time": end_time}, ...]}
"""
def query_vector(query: str, n_results: int = 1):
    query_results = collection.query(
        query_texts=[query],
        n_results=n_results,
    )

    return query_results["documents"]

if __name__ == "__main__":
    vectorize(["Hello, world!"])
    print(query_vector("!", 1))
