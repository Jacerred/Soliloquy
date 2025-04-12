import os
import pathlib
from typing import List

base_dir = pathlib.Path(__file__).parent.resolve()

chunk_base_dir = f"{base_dir}\\video_chunks"

"""
chunkVideo(str: path_to_video) -> List:
- Returns list of absolute paths to 90 min video chunks - video_chunk dir
"""
def chunkVideo(path_to_video: str) -> List:
    video_name = os.path.basename(path_to_video)
    path_to_video = f"{base_dir}\\{path_to_video}"

    # create dir for chunks of specific video
    os.mkdir(f"{chunk_base_dir}\\{video_name}")

    # using ffmpeg, chunk a video into n min chunks
    chunk_seconds = 10*60

    cmd = f"{base_dir}\\ffmpeg -i {path_to_video} -threads 3 \
        -vcodec copy -f segment -segment_time {chunk_seconds} \
        -reset_timestamps 1 \
        {chunk_base_dir}\\{video_name}\\{video_name}_cam_out_h264_%02d.mp4"

    os.system(cmd)

    return os.listdir(f"{chunk_base_dir}\\{video_name}")

print(chunkVideo("FootballVi.mp4"))