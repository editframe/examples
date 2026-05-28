#!/bin/bash
# v11 — Mux script for Claude Code Agent View demo (36s).
# Music: Pixabay CC0 — see README for attribution.
# Restore arm-pull impacts via 4 separate Punch Whoosh inputs (asplit doesn't survive the mux otherwise).
set -e
cd "$(dirname "$0")"

KBD="./audio/keyboard.wav"
PUNCH="./audio/punch-whoosh.wav"

VIN="output/demo-silent.mp4"
MUSIC_SRC="./audio/music-bed.mp3"
VOUT="output/demo.mp4"

[ -f "$VIN" ] || { echo "MISSING $VIN — run 'npm run render' then 'mv output/demo.mp4 output/demo-silent.mp4' first"; exit 1; }
for f in "$MUSIC_SRC" "$KBD" "$PUNCH"; do
  [ -f "$f" ] || { echo "MISSING $f"; exit 1; }
done

ffmpeg -y -hide_banner -v error \
  -i "$VIN" \
  -i "$MUSIC_SRC" \
  -i "$KBD" \
  -i "$PUNCH" \
  -i "$PUNCH" \
  -i "$PUNCH" \
  -i "$PUNCH" \
  -i "$KBD" \
  -filter_complex "
    [1:a]volume=1.0[mus];
    [2:a]atrim=duration=1.2,asetpts=PTS-STARTPTS,volume=0.35,adelay=800|800[t1];
    [3:a]atrim=duration=0.55,asetpts=PTS-STARTPTS,volume=1.5,adelay=13100|13100[i1];
    [4:a]atrim=duration=0.55,asetpts=PTS-STARTPTS,volume=1.5,adelay=14100|14100[i2];
    [5:a]atrim=duration=0.55,asetpts=PTS-STARTPTS,volume=1.5,adelay=15100|15100[i3];
    [6:a]atrim=duration=0.55,asetpts=PTS-STARTPTS,volume=1.5,adelay=16100|16100[i4];
    [7:a]atrim=duration=1.1,asetpts=PTS-STARTPTS,volume=0.35,adelay=22700|22700[t2];
    [mus][t1][i1][i2][i3][i4][t2]amix=inputs=7:duration=longest:normalize=0[out]
  " \
  -map 0:v -map "[out]" \
  -c:v copy -c:a aac -b:a 192k -shortest \
  "$VOUT"

echo "✓ Muxed audio → $VOUT"
ls -la "$VOUT"
