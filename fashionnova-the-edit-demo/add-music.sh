#!/usr/bin/env bash
# Fashion Nova — The Edit · music mux
# Lays the "Velvet_Pavement" track under the silent render to produce the final cut.
# No SFX, no video composite — the on-model stills are animated in-engine (FN exposes no
# usable brand video). The video stream is copied (fast, lossless).
#
#   npm run render          → output/demo-silent.mp4   (silent, ~25s)
#   bash add-music.sh       → output/demo.mp4          (music muxed — the committed cut)
#
# The committed output/demo.mp4 already has this audio baked in; this script just documents
# and reproduces it.
set -e
cd "$(dirname "$0")"

SILENT="${SILENT:-output/demo-silent.mp4}"
MUSIC="${MUSIC:-audio/Fashionnova Velvet_Pavement.mp3}"
OUT="${OUT:-output/demo.mp4}"
MUSIC_START="${MUSIC_START:-0}"   # purpose-built ~25s track; start at the top
FADE_IN="${FADE_IN:-0.3}"         # punchy (FN energy), short fade

[ -f "$SILENT" ] || { echo "missing $SILENT — run: NO_COLOR=1 FORCE_COLOR=0 npm run render"; exit 1; }
[ -f "$MUSIC" ]  || { echo "missing $MUSIC"; exit 1; }

dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$SILENT")
fo=$(awk -v d="$dur" 'BEGIN{printf "%.2f", d-1.5}')   # fade-out starts 1.5s before the end

ffmpeg -y -v error -i "$SILENT" -ss "$MUSIC_START" -i "$MUSIC" \
  -filter_complex "[1:a]atrim=0:${dur},asetpts=PTS-STARTPTS,afade=t=in:st=0:d=${FADE_IN},afade=t=out:st=${fo}:d=1.5,alimiter=limit=0.97[am]" \
  -map 0:v -map "[am]" -c:v copy -c:a aac -b:a 192k -movflags +faststart "$OUT"

echo "-> $OUT ($(ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT")s, music from ${MUSIC_START}s)"
