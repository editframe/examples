#!/usr/bin/env bash
# ============================================================================
# add-audio.sh — reproduce output/demo.mp4 from output/demo-silent.mp4
# ============================================================================
# This is the "video-in-frame" finalize step. The Editframe render is SILENT and
# leaves two fixed empty wells (WELL_A, WELL_B). This script:
#   1. Reads the well rects from wells.json and builds matching rounded-rect masks.
#   2. Composites the REAL Gymshark brand footage into each well (FFmpeg overlay):
#        athlete clip -> WELL_A,  fabric-macro clip -> WELL_B
#      Each clip starts DURING the incoming transition so the well reveals filled,
#      never dark-empty, and fades out before its scene cuts.
#   3. Muxes the music bed ("Gymshark Summit_at_Dawn") from 0:30 with a fade in,
#      a fade out under the CTA hold, and a brick-wall limiter.
#
# The committed output/demo.mp4 ALREADY contains all of this — run this only to
# regenerate it (e.g. after re-rendering, or after swapping footage/music).
#
# Requires: ffmpeg, ffprobe, python3 + Pillow (PIL).
# ============================================================================
set -e
cd "$(dirname "$0")"

BASE="output/demo-silent.mp4"
OUT="output/demo.mp4"
MUSIC="audio/Gymshark Summit_at_Dawn.mp3"
ATH="audio/brand-video/athlete-gslc-9x16.mp4"
FAB="audio/brand-video/fabric-macro.mp4"

MUSIC_START="${MUSIC_START:-30}"   # later, fuller section of the track
FADE_IN="${FADE_IN:-1.5}"          # smooth music fade-in

[ -f "$BASE" ] || { echo "ERROR: $BASE not found — run 'npm run render' first."; exit 1; }

dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$BASE")

# rounded-rect masks sized to the wells.json rects + the rects themselves
coords=$(python _finalize_helper.py ".")
read AX AY AW AH BX BY BW BH <<< "$coords"
echo "WELL_A=${AX},${AY},${AW}x${AH}   WELL_B=${BX},${BY},${BW}x${BH}"

# 1+2) composite the real brand footage into the two wells
#   athlete -> WELL_A (footage enters at 4.35s, DURING the incoming transition)
#   fabric  -> WELL_B (footage enters at 10.85s, same reason)
ffmpeg -y -v error -t "$dur" -i "$BASE" \
  -ss 1.0 -t 4.35 -i "$ATH" -ss 0.5 -t 3.35 -i "$FAB" \
  -loop 1 -t "$dur" -i "_mask_A.png" -loop 1 -t "$dur" -i "_mask_B.png" \
  -filter_complex "[1:v]scale=${AW}:-2,crop=${AW}:${AH},fps=30[a];[3:v]scale=${AW}:${AH},fps=30[ma];[a][ma]alphamerge,setpts=PTS-STARTPTS+4.35/TB,fade=t=in:st=4.35:d=0.22:alpha=1,fade=t=out:st=8.15:d=0.35:alpha=1[oa];[2:v]scale=${BW}:-2,crop=${BW}:${BH},fps=30[b];[4:v]scale=${BW}:${BH},fps=30[mb];[b][mb]alphamerge,setpts=PTS-STARTPTS+10.85/TB,fade=t=in:st=10.85:d=0.22:alpha=1,fade=t=out:st=13.65:d=0.35:alpha=1[ob];[0:v][oa]overlay=${AX}:${AY}:enable='between(t,4.35,8.5)'[x];[x][ob]overlay=${BX}:${BY}:enable='between(t,10.85,14)'[out]" \
  -map "[out]" -t "$dur" -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 18 -preset medium -movflags +faststart \
  "_tmp_composite.mp4"

# 3) music: from MUSIC_START, fade in, fade out over the last ~1.5s, limiter
fo=$(awk -v d="$dur" 'BEGIN{printf "%.2f", d-1.5}')
ffmpeg -y -v error -i "_tmp_composite.mp4" -ss "$MUSIC_START" -i "$MUSIC" \
  -filter_complex "[1:a]atrim=0:${dur},asetpts=PTS-STARTPTS,afade=t=in:st=0:d=${FADE_IN},afade=t=out:st=${fo}:d=1.5,alimiter=limit=0.97[am]" \
  -map 0:v -map "[am]" -c:v copy -c:a aac -b:a 192k -movflags +faststart "$OUT"

rm -f "_tmp_composite.mp4" "_mask_A.png" "_mask_B.png"
echo "-> $OUT ($(ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT")s | music from ${MUSIC_START}s, fade-in ${FADE_IN}s)"
