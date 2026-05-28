#!/bin/bash
# Post-process: mix 3 tasteful SFX hits onto the demo video.
# Used very sparingly — once per signature visual beat.
set -e
cd "$(dirname "$0")/.."

VIDEO_IN="output/demo-v4-sfx.mp4"
VIDEO_OUT="output/demo-final.mp4"
SFX="public/sfx"

# Each line: <delay_ms> <volume> <sfx_file>
# Scene start offsets: S1=0, S2=4000, S3=10000, S4=15000, S5=22000, S6=28000, S7=33000
# Tightened to the actual visual landings.
#   Scene 1: logo clip-path completes around t=1.1s (1100ms)
#   Scene 6: STAR badge entrance peaks at scene-local 3.0s → global 31000ms
#   Scene 7: yellow underline draws fully by scene-local 1.9s → global 34900ms
CUES=$(cat <<EOF
1100  0.55 reveal.mp3
31000 0.60 twinkle.mp3
34900 0.50 reveal.mp3
EOF
)

INPUTS=(-i "$VIDEO_IN")
FILTERS=()
i=1
while read -r delay vol file; do
  [ -z "$file" ] && continue
  INPUTS+=(-i "$SFX/$file")
  FILTERS+=("[$i:a]volume=$vol,adelay=${delay}|${delay}[a$i]")
  i=$((i+1))
done <<< "$CUES"

N=$((i-1))
MIX_INPUTS=""
for k in $(seq 1 $N); do MIX_INPUTS+="[a$k]"; done

FILTER_GRAPH=$(IFS=';'; echo "${FILTERS[*]}")
FILTER_GRAPH="${FILTER_GRAPH};${MIX_INPUTS}amix=inputs=$N:duration=longest:normalize=0,volume=1.6[mixed]"

ffmpeg -y -v error -stats \
  "${INPUTS[@]}" \
  -filter_complex "$FILTER_GRAPH" \
  -map 0:v -map "[mixed]" \
  -c:v copy -c:a aac -b:a 192k -shortest \
  "$VIDEO_OUT"

echo ""
echo "Done: $VIDEO_OUT ($N SFX cues mixed)"
ffmpeg -i "$VIDEO_OUT" -vn -af "volumedetect" -f null - 2>&1 | grep -E "mean_volume|max_volume"
