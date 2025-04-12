# Soliloquy

## To Run Backend
`fastapi dev main.py`

## Kewl Commands
Get duration of vide in HH:MM:SS:MS
`ffmpeg -i FootballVi.mp4 2>&1 | grep "Duration"| cut -d ' ' -
f 4 | sed s/,//`
