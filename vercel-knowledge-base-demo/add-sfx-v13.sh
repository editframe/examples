#!/bin/bash
# v13 — Mux script for Vercel Deploy demo (22.5s).
# Music: Pixabay CC0 — "Big Beginning" by Jonas Blakewood. See CREDITS.md.
# Driving electronic — fits the Vercel deploy-payoff curve.
set -e
cd "$(dirname "$0")"

VIN="output/demo-silent.mp4"
SONG="audio/music-bed.mp3"
VOUT="output/demo.mp4"

MUSIC_VOL=0.16
FADE_IN_DUR=1.5
FADE_OUT_DUR=2.0
VIDEO_DUR=22.5
FADE_OUT_START=20.5
# Start at 0; replace with a later offset if a track's intro should be trimmed.
SS_OFFSET=0

[ -f "$VIN" ] || { echo "MISSING $VIN — run 'NO_COLOR=1 FORCE_COLOR=0 npm run render' first"; exit 1; }
for f in "$SONG"; do
  [ -f "$f" ] || { echo "MISSING $f"; exit 1; }
done

ffmpeg -y -hide_banner -v error \
  -i "$VIN" \
  -ss "$SS_OFFSET" -t "$VIDEO_DUR" -i "$SONG" \
  -filter_complex "
    [1:a]volume=$MUSIC_VOL,afade=t=in:st=0:d=$FADE_IN_DUR,afade=t=out:st=$FADE_OUT_START:d=$FADE_OUT_DUR[bed];
    [bed]anull[out]
  " \
  -map 0:v -map "[out]" \
  -c:v copy -c:a aac -b:a 192k -shortest \
  "$VOUT"

echo "✓ Muxed audio → $VOUT"
ls -la "$VOUT"
