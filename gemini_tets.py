from google import genai
from IPython.display import Markdown
import time
import datetime
import platform
import os
from moviepy.video.io.ffmpeg_tools import ffmpeg_extract_subclip
from moviepy.editor import VideoFileClip

client = genai.Client(api_key="AIzaSyBvEquIsjGuvuwQ5jvoNPpV1NI82-R8gYs")

def chop_video(input_file, slice_duration=600):
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
    return num_slices

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

    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=[
            video_file,
            "First find the length of the video, then Summarize this video in a paragraph, and generate a summary when any event occur. "
            "Please print in the format: length of video (.. hours .. minutes .. seocnd)\\noverall summary (only the summary, do not include any title)\\ntimestamp (min:sec)\\n"
            "summary of the event (only the summary, do not include any title)\\nlater summaries. print an empty line between "
            "length of video and overall summary, overall and event summaries, and between each event summaries. "
            "Do not print anything  like 'here is the result' or 'here are the summaries'"])

    with open("log.txt", "a") as file:
        file.write(response.text)
        file.write("-" * 100 + "\n\n")

    print("Write complete")

def process_video(file_path, time):
    open("log.txt", "w").close()
    num_slices = chop_video(file_path, time)
    base, extension = os.path.splitext(os.path.basename(file_path))

    for i in range(1, num_slices + 1):
        part_path = base + f"_part{i}" + extension
        upload_image(part_path)
        if os.path.exists(part_path):
            os.remove(part_path)

def query(query_text):
    with open("log.txt", "r") as file:
        output_content = file.read()

    response = client.models.generate_content(
        model="gemini-2.5-pro-exp-03-25",
        contents=[
            output_content,
            "Here is a summary of a video, which is sliced to chunks of maximum 10 minute."
            " Each section of summary represent the summary of the chunk, which include"
            " the length of the chunk, a overall summary of the chunk and timestamps and summary"
            " of events that occured in the chunk. Please use these information to answer the question given, "
            "and provide timestamp citations (in terms of the overall video. For example, if first chunk is 50 second,"
            " then second chunk's 35 second entry's citation is 1:25 in terms of the overall video.) "
            "print everything in terms of the overall video for both answers to the questions and the citation, do not mention chunks at all",
            query_text
        ]
    )

    with open("query_result.txt", "w") as file:
        file.write(response.text)

    print("Query complete")

process_video("C:/Users/huyic/Desktop/high school files/Chemistry Final Project.mp4", 80)
query("What's wrong with the van in Simpsons according to the video? Why does it defy physics or chemistry?")