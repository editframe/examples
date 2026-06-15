#!/usr/bin/env bash
# Allbirds — Tree Runner NZ · reproduce the final shipped cut.
#
# Takes the silent render (output/demo-silent.mp4) and produces output/demo.mp4 by:
#   1. compositing the two real Allbirds material/lifestyle clips into the video "wells"
#      (rounded-rect frames the render leaves as posters), revealed DURING the incoming
#      transition so each well appears already filled, and
#   2. muxing the music bed "The Sharp Pivot" from 0:08 with a gentle fade-in / fade-out
#      and a final limiter.
#
# All paths are repo-relative. The committed output/demo.mp4 already contains this result;
# this script documents and reproduces it. Requires ffmpeg + python3 (Pillow).
set -e
cd "$(dirname "$0")"

BASE="output/demo-silent.mp4"          # silent render (npm run render); gitignored
OUT="output/demo.mp4"                   # final, committed
VA="audio/well-a-people-walk.mp4"       # PORTRAIT lifestyle (760x1000) -> WELL_A
VB="audio/well-b-material-macro.mp4"    # LANDSCAPE material macro (1920x1080) -> WELL_B
MUSIC="audio/the-sharp-pivot.mp3"       # "Alibirds The_Sharp_Pivot"
MUSIC_START="${MUSIC_START:-8}"         # music begins 8s into the track
FADE_IN="${FADE_IN:-1.2}"

[ -f "$BASE" ] || { echo "Missing $BASE — run: NO_COLOR=1 FORCE_COLOR=0 npm run render"; exit 1; }
dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$BASE")

# WELL rects — must match src/constants.ts (WELL_A / WELL_B) and wells.json.
AX=160; AY=540; AW=760; AH=1000; AR=22     # WELL_A portrait, active 6.0–11.0s
BX=120; BY=760; BW=840; BH=560;  BR=18     # WELL_B landscape, active 14.5–19.0s

# Rounded-rect alpha masks sized to each well.
python - "$AW" "$AH" "$AR" _mask_a.png <<'PY'
import sys; from PIL import Image, ImageDraw
w,h,r,out = int(sys.argv[1]),int(sys.argv[2]),int(sys.argv[3]),sys.argv[4]
m = Image.new("L",(w,h),0); ImageDraw.Draw(m).rounded_rectangle([0,0,w-1,h-1],radius=r,fill=255); m.save(out)
PY
python - "$BW" "$BH" "$BR" _mask_b.png <<'PY'
import sys; from PIL import Image, ImageDraw
w,h,r,out = int(sys.argv[1]),int(sys.argv[2]),int(sys.argv[3]),sys.argv[4]
m = Image.new("L",(w,h),0); ImageDraw.Draw(m).rounded_rectangle([0,0,w-1,h-1],radius=r,fill=255); m.save(out)
PY

# Composite both wells (footage starts during the incoming transition so they reveal filled).
ffmpeg -y -v error -t "$dur" -i "$BASE" \
  -ss 0.5 -t 5.6 -i "$VA" -ss 0.5 -t 5.1 -i "$VB" \
  -loop 1 -t "$dur" -i _mask_a.png -loop 1 -t "$dur" -i _mask_b.png \
  -filter_complex "\
[1:v]scale=${AW}:-2,crop=${AW}:${AH},fps=30[a];\
[3:v]scale=${AW}:${AH},fps=30[ma];\
[a][ma]alphamerge,setpts=PTS-STARTPTS+5.9/TB,fade=t=in:st=5.9:d=0.25:alpha=1,fade=t=out:st=10.6:d=0.4:alpha=1[oa];\
[2:v]scale=-2:${BH},crop=${BW}:${BH},fps=30[b];\
[4:v]scale=${BW}:${BH},fps=30[mb];\
[b][mb]alphamerge,setpts=PTS-STARTPTS+14.4/TB,fade=t=in:st=14.4:d=0.25:alpha=1,fade=t=out:st=18.6:d=0.4:alpha=1[ob];\
[0:v][oa]overlay=${AX}:${AY}:enable='between(t,5.9,11)'[x];\
[x][ob]overlay=${BX}:${BY}:enable='between(t,14.4,19)'[out]" \
  -map "[out]" -t "$dur" -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 18 -preset medium -movflags +faststart \
  _video.mp4

# Mux the music: trim to length, fade in, fade out 1.8s before the end, soft limiter.
fo=$(awk -v d="$dur" 'BEGIN{printf "%.2f", d-1.8}')
ffmpeg -y -v error -i _video.mp4 -ss "$MUSIC_START" -i "$MUSIC" \
  -filter_complex "[1:a]atrim=0:${dur},asetpts=PTS-STARTPTS,afade=t=in:st=0:d=${FADE_IN},afade=t=out:st=${fo}:d=1.8,alimiter=limit=0.95[am]" \
  -map 0:v -map "[am]" -c:v copy -c:a aac -b:a 192k -movflags +faststart "$OUT"

rm -f _mask_a.png _mask_b.png _video.mp4
echo "-> $OUT ($(ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT")s, with audio)"
