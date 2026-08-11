#!/usr/bin/env bash
# Regenerate a demo's poster.jpg (the project picker's thumbnail) from its
# rendered output/demo.mp4 — grabs a frame 45% in, scaled/cropped to
# 1280x720 (landscape) or 720x1280 (portrait).
#
# Usage:
#   ./generate-posters.sh                 # only demos missing a poster
#   ./generate-posters.sh --all           # regenerate every demo
#   ./generate-posters.sh <demo-dir>...   # specific demos
set -euo pipefail
cd "$(dirname "$0")"

demos=(
  figma-agent-demo vercel-deploy-demo vercel-knowledge-base-demo
  claude-security-demo claude-code-demo claude-office-demo
  claude-code-financial-demo claude-opus48-demo cursor-jira-demo
  cursor-sdk-demo cursor-cloud-agents-demo fal-ai-demo clerk-cli-demo
  codex-demo linear-agents-demo allbirds-tree-runner-demo
  fashionnova-the-edit-demo gymshark-geo-seamless-demo olipop-demo
  rhode-demo
)

if [ "${1:-}" = "--all" ]; then
  shift
elif [ $# -gt 0 ]; then
  demos=("$@")
  unset 'demos[0]' # positional params replaced below
  demos=("$@")
fi

for d in "${demos[@]}"; do
  v="$d/output/demo.mp4"
  [ -f "$v" ] || { echo "SKIP $d (no output/demo.mp4)"; continue; }
  if [ "${FORCE:-0}" != "1" ] && [ $# -eq 0 ] && [ -f "$d/poster.jpg" ]; then
    echo "SKIP $d (poster.jpg exists)"
    continue
  fi
  dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$v")
  t=$(echo "$dur * 0.45" | bc)
  wh=$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 "$v")
  w=${wh%,*}; h=${wh#*,}
  if [ "$w" -gt "$h" ]; then scale="1280:720"; else scale="720:1280"; fi
  ffmpeg -v error -ss "$t" -i "$v" -frames:v 1 \
    -vf "scale=${scale}:force_original_aspect_ratio=increase,crop=${scale}" \
    -q:v 3 "$d/poster.jpg" -y
  echo "OK   $d (${w}x${h} @ ${t}s)"
done
