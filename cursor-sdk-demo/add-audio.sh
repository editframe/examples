#!/bin/bash
# cursor-sdk — Music: Glass_and_Timber + keyboard SFX on the two HUMAN-typed bits:
#   1) Scene1_2 "uv add cursor-sdk"           : global 200ms,  ~1190ms (70ms/char)
#   2) Scene4   line 4 `model="composer-2.5-fast"` typed slowly in Phase 1:
#        starts scene-local 200 (+7500) -> global 7700ms, completes ~9350ms (1.65s)
# NO SFX on: the installed-package output; the FAST Phase-3 AI code generation in
# Scene4 (the rest of the code, 3ms/char — too fast to read as typing); the Scene5
# terminal command "$ uv run …" (5ms/char, also too fast — user removed it); the
# agent's tool-calls/thinking; or the title cards. No clicks in this demo.
set -e
cd "$(dirname "$0")"

VIN="output/demo-silent.mp4"
VOUT="output/demo.mp4"
MUS="audio/music.mp3"
KBD="audio/keyboard.wav"
for f in "$VIN" "$MUS" "$KBD"; do [ -f "$f" ] || { echo "MISSING $f"; exit 1; }; done

# Video ≈ 26.82s. Bed 0.22, fade in 0.4s, fade out last 1.8s (st=25.0).
ffmpeg -y -hide_banner -v error \
  -i "$VIN" \
  -i "$MUS" \
  -i "$KBD" \
  -i "$KBD" \
  -filter_complex "
    [1:a]atrim=duration=26.9,asetpts=PTS-STARTPTS,loudnorm=I=-26:TP=-4:LRA=7,aresample=48000,afade=t=in:st=0:d=0.4,afade=t=out:st=25.0:d=1.8[mus];
    [2:a]atrim=duration=1.19,asetpts=PTS-STARTPTS,volume=0.7,adelay=200|200[k1];
    [3:a]atrim=duration=1.65,asetpts=PTS-STARTPTS,volume=0.7,adelay=7700|7700[k2];
    [mus][k1][k2]amix=inputs=3:duration=longest:normalize=0[out]
  " \
  -map 0:v -map "[out]" \
  -c:v copy -c:a aac -b:a 192k -shortest \
  "$VOUT"

echo "✓ Muxed audio → $VOUT"
