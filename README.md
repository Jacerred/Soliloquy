## Inspiration
Our inspiration came from the realization that our camera rolls were overflowing with random videos and unsorted images. Often, you would think of a past moment but you wouldn't be able to find it in the mess of a camera roll. Why can’t this content be as easily searchable as a piece of text?

## What it does
Soliloquy intelligently interprets and indexes your video library, turning it into a searchable personal archive. It's like an advanced camera roll allowing you to instantly query specific moments, analyze trends across your videos, and relive the important parts of your life captured on video.

While initially marketed for personal use, the applications for this program are endless; based on the data given, it can be used for sport analytics (e.g. FRC scouting), car dash cam footage (e.g. insurance claims), or body cam footage (e.g. generate police footage reports). Fundamentally, our program provides an unbiased analysis of videos for interpretation and quick-access.

## How we built it
Frontend
Electron allowed us to make a desktop application out of a web application, which was developed with React. React handles the video uploads, queries, and indexing. These functions are facilitated by the communications with the backend through Python FastAPI and with the local file system through Electron.

Backend:
Each uploaded video is divided into 90-second segments. These segments are processed using Gemini 2.0 Flash VLM, which generates a sentence-level summary for every 5-second interval within each chunk.

The segmented summaries are then passed to Gemini 2.5, which creates a comprehensive daily summary and handles user queries.

Each chunk is also vectorized and stored in a local embedding database (ChromaDB), enabling RAG for answering user queries across their entire journal archive. These embeddings are stored locally, as they can be regenerated from the cloud-based summary data when needed.

Both the chunk-level summaries and the aggregated daily summaries are pushed to MongoDB, where they can be quickly retrieved as needed along with the timestamps of each video.

## Challenges we ran into
Incorporating three unique frameworks–React, Electron, and Tailwind–together for one cohesive desktop application.
Adjusting prompt and generation intervals for Gemini API to optimize the accuracy of its summarizations.
The schema / API endpoints needed to constantly evolve as we fleshed out the technical implementation (integration between frontend - backend - Gemini API calls)

## Accomplishments that we're proud of
The high accuracy of Gemini API on summarizing and extraction information from videos; specifically, we are impressed with how we could isolate timestamps of events for query and cite these timestamps when answering the prompt
The frontend of the program ended up being well-designed, interactive, and visually appealing. We were able to add most functionality we thought of to improve the usability of our application.
The backend is able to write and query DB entries with timestamps. This helps us identify all dates with logs available and search for the most relevant log entries to answer users’ prompts.
Chunk embedding metadata has start and end timestamps which makes it much easier for the model to point the user towards a specific journal on a specific day via the hyperlink feature

## What we learned
How to use Gemini API to interpret and summarize videos–then perform information retrieval on the responses
How to set up a frontend with multiple frameworks for a desktop application and interface with FastAPI

## What's next for Soliloquy
Send GPS location to help VLM figure out what's going on by incorporating the location as a part of the context. For example, one can use this feature to find lost items by location
Add security for MongoDB, this prevents user information from leakage.
Allow users to add context for each video, which helps the AI model to better understand the video and generate more accurate results.
Make the application scalable and possibly incorporate a web version for easy access anywhere 
To keep privacy, instead of Gemini API use local LLama VLM

# RUN

Run - all in my-project directory
`npm install`

Then start react app
`npm start`

Then start electron app
`./node_modules/.bin/electron electron.js`
(could not for the life of me figure out why `npm run electron` would not work)

Start backend - backend dir
`fastapi dev main.py`