#!/bin/bash
# add-audio.sh — mux the music bed onto the silent render → output/demo.mp4
#
# Pipeline:
#   NO_COLOR=1 FORCE_COLOR=0 npm run render   -> output/demo-silent.mp4   (Editframe headless render)
#   bash add-audio.sh                         -> output/demo.mp4          (music bed muxed — the committed cut)
#
# The shipped output/demo.mp4 already has this audio baked in; this script reproduces it
# from a fresh silent render. Music only — no SFX. See CREDITS.md for music provenance.
set -e
cd "$(dirname "$0")"

VIN="${VIN:-output/demo-silent.mp4}"
MUSIC="./audio/music-bed.mp3"
VOUT="output/demo.mp4"

[ -f "$VIN" ]   || { echo "MISSING $VIN — run 'NO_COLOR=1 FORCE_COLOR=0 npm run render' first"; exit 1; }
[ -f "$MUSIC" ] || { echo "MISSING $MUSIC"; exit 1; }

# 32.0s video. Music bed loudnorm-normalized, fade in 0.6s, fade out over the last 1.5s.
ffmpeg -y -hide_banner -v error \
  -i "$VIN" \
  -i "$MUSIC" \
  -filter_complex "
    [1:a]atrim=duration=32.0,asetpts=PTS-STARTPTS,
         loudnorm=I=-16:TP=-1.5:LRA=11,
         afade=t=in:st=0:d=0.6,
         afade=t=out:st=30.5:d=1.5,
         alimiter=limit=0.97[mus]
  " \
  -map 0:v -map "[mus]" \
  -c:v copy -c:a aac -b:a 192k -shortest \
  "$VOUT"

echo "Muxed music -> $VOUT"
ls -la "$VOUT"
