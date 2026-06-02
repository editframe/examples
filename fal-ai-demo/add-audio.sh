#!/bin/bash
# fal-ai — MUSIC ONLY (Old_Books_and_Cold_Tea). Per user: cursor only HOVERS the
# tabs / Assets, it does not click anything → NO click SFX. No prompt typed → no
# keyboard SFX. Just a gentle music bed with a clean fade-out.
set -e
cd "$(dirname "$0")"

VIN="output/demo-silent.mp4"
VOUT="output/demo.mp4"
MUS="audio/music.mp3"
[ -f "$VIN" ] || { echo "MISSING $VIN"; exit 1; }
[ -f "$MUS" ] || { echo "MISSING $MUS"; exit 1; }

# Video ≈ 14.4s (SceneHyper removed). Fade in 0.4s, fade out last 1.8s (starts ~12.8s).
ffmpeg -y -hide_banner -v error \
  -i "$VIN" \
  -i "$MUS" \
  -filter_complex "
    [1:a]atrim=duration=14.5,asetpts=PTS-STARTPTS,loudnorm=I=-26:TP=-4:LRA=7,aresample=48000,afade=t=in:st=0:d=0.4,afade=t=out:st=12.8:d=1.8[mus]
  " \
  -map 0:v -map "[mus]" \
  -c:v copy -c:a aac -b:a 192k -shortest \
  "$VOUT"

echo "✓ Muxed audio → $VOUT"
