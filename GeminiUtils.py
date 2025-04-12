from google import genai
from IPython.display import Markdown
import time
import datetime
import platform
import os
from moviepy.video.io.ffmpeg_tools import ffmpeg_extract_subclip
from moviepy.editor import VideoFileClip

client = genai.Client(api_key="AIzaSyBQDwNYgMHZTMrX7w6XlWFatG0TPx2XunQ")

def chop_video(input_file, slice_duration):
    clip = VideoFileClip(input_file)
    total_duration = clip.duration
    print(f"Total video duration: {total_duration:.2f} seconds")
    
    num_slices = int(total_duration // slice_duration)
    if total_duration % slice_duration:
        num_slices += 1

    new_file = os.path.basename(input_file)
    base, ext = os.path.splitext(new_file)
    
    for i in range(num_slices):
        start_time = i * slice_duration
        end_time = min((i + 1) * slice_duration, total_duration)
        output_filename = f"{base}_part{i+1}{ext}"
        print(f"Extracting slice {i+1}: {output_filename} from {start_time:.2f} sec to {end_time:.2f} sec")
        ffmpeg_extract_subclip(input_file, start_time, end_time, targetname=output_filename)
    
    clip.close()
    print("Video chopping complete.")
    return num_slices, total_duration

def upload_image(file_path):
    print("Uploading file")
    video_file = client.files.upload(file=file_path)
    print(f"Completed upload: {video_file.uri}")

    while video_file.state.name == "PROCESSING":
        time.sleep(1)
        video_file = client.files.get(name=video_file.name)

    if video_file.state.name == "FAILED":
        raise ValueError(video_file.state.name)

    print('Video is active')

    with open("log.txt", "a") as file:
        clip = VideoFileClip(file_path)
        total_duration = clip.duration
        clip.close()

        hours = int(total_duration // 3600)
        minutes = int((total_duration % 3600) // 60)
        seconds = int(total_duration % 60)
        file.write(f"length of video ({hours:02d} hours {minutes:02d} minutes {seconds:02d} second)\n\n")

    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=[
            video_file,
            "Summarize this video in a paragraph. In addition, generate a short paragraph of summary of the current scene every 5 second. "
            "Please print in the format: overall summary (only the summary, do not include any title)\\ntimestamp (min:sec)\\n"
            "summary of the event (only the summary, do not include any title)\\nlater summaries. print an empty line between length"
            " of video and overall summary, overall and event summaries, and between each event summaries. Do not print anything "
            "like 'here is the result' or 'here are the summaries'"])

    with open("log.txt", "a") as file:
        file.write(response.text)
        file.write("\n\n" + "-" * 100 + "\n\n")

    print("Write complete")

def process_video(file_path, time = 125):
    open("log.txt", "w").close()
    num_slices, total_duration = chop_video(file_path, time)
    base, extension = os.path.splitext(os.path.basename(file_path))

    for i in range(1, num_slices + 1):
        part_path = base + f"_part{i}" + extension
        upload_image(part_path)
        if os.path.exists(part_path):
            os.remove(part_path)
    
    return total_duration

"""
query_text: the prompt for the query
output_content: the content of the days log file retrived from mongoDB
"""

def query(query_text, output_content):
    response = client.models.generate_content(
        model="gemini-2.5-pro-exp-03-25",
        contents=[
            output_content,
            "Here is a summary of a video. The summary is divided into sections, each belong to a different chunk "
            "of the videos. Each section of summary represent the summary of the chunk, which include "
            "the length of the chunk, a overall summary of the chunk and timestamps and summary "
            "of events that occured in the chunk. Please use these information to answer the question given, "
            "and provide timestamp citations (in terms of the overall video. For chunks other than the first one, "
            "sum the time stamp with the previous chunk's lengthes) print everything in terms of the overall video "
            "for both answers to the questions and the citations timestamps, do not reference chunks or segment in the response",
            query_text
        ]
    )

    return response.text

"""
output_content: the content of the days log file retrived from mongoDB
"""
def overall_summary(output_content):
    response = client.models.generate_content(
        model="gemini-2.5-pro-exp-03-25",
        contents=[
            output_content,
            "Here is a summary of a video. The summary is divided into sections, each belong to a different chunk "
            "of the videos. Each section of summary represent the summary of the chunk, which include "
            "the length of the chunk, a overall summary of the chunk and timestamps and summary of events "
            "that occured in the chunk. Please use these information to geneate an overall summary for the entire video"
        ]
    )

    return response.text

"""
db_output: the output from the vector DB query
query_text: the prompt for the query
"""
def query_with_db(db_output, query_text):
    for i in range(0, len(db_output["documents"][0])):
        merged_string += dp_output['metadatas'][i]['start_time'] + "\n" +  db_output["documents"][0][i] + "\n\n"

    response = client.models.generate_content(
        model="gemini-2.5-pro-exp-03-25",
        contents=[
            merged_string,
            "Here is a part of the summary of a video. The summary is divided into sections, each belong to a different chunk "
            "of the videos. Each section of summary represent the summary of the chunk, which include the start time of the chunk"
            "the length of the chunk, a overall summary of the chunk and timestamps and summary that occured in the chunk. "
            "The chunks in this summary are the most relavent ones. Please use these information to answer the question given, "
            "and provide date citations (using the date part of the starting time). do not reference chunks or segment in the response",
            query_text
        ]
    )

    return response.text


#duration = process_video("C:/Users/huyic/Desktop/cam_out_h264_07.mp4", 101)
#query("Who are the sideline reporters?")
#overall_summary()