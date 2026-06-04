#!/usr/bin/env bash
set -euo pipefail

visual_output="output/demo-visual.mp4"
final_output="output/demo.mp4"
score="public/audio/openclaw-score.m4a"

mkdir -p output

editframe render -o "$visual_output"

ffmpeg -y -hide_banner -loglevel error \
  -i "$visual_output" \
  -i "$score" \
  -filter_complex "[1:a]volume=0.55[a]" \
  -map 0:v:0 \
  -map "[a]" \
  -c:v copy \
  -c:a aac \
  -b:a 160k \
  -movflags +faststart \
  "$final_output"

rm -f "$visual_output"
