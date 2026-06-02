#!/bin/bash
# clerk-cli — Music: LowTide (BEGINNING section) + keyboard SFX on the two typed
# terminal commands ONLY. Per rules: keyboard SFX fires when a command line is
# typed to trigger output generation; the streaming output lines + logo outro get
# nothing; there are no mouse clicks in this terminal demo.
#
# Typed commands (SceneTerminal is first in sequence, so scene-local == global):
#   clerk login : starts 300ms,  cmdDuration 500ms
#   clerk init  : starts 2900ms, cmdDuration 500ms
set -e
cd "$(dirname "$0")"

VIN="output/demo-silent.mp4"
VOUT="output/demo.mp4"
MUS="audio/music.mp3"
KBD="audio/keyboard.wav"
for f in "$VIN" "$MUS" "$KBD"; do [ -f "$f" ] || { echo "MISSING $f"; exit 1; }; done

# Video ≈ 17.05s. Music bed 0.22, fade in 0.4s, fade out over last 1.8s (st=15.25).
ffmpeg -y -hide_banner -v error \
  -i "$VIN" \
  -i "$MUS" \
  -i "$KBD" \
  -i "$KBD" \
  -filter_complex "
    [1:a]atrim=duration=17.1,asetpts=PTS-STARTPTS,loudnorm=I=-26:TP=-4:LRA=7,aresample=48000,afade=t=in:st=0:d=0.4,afade=t=out:st=15.25:d=1.8[mus];
    [2:a]atrim=duration=0.5,asetpts=PTS-STARTPTS,volume=0.7,adelay=300|300[k1];
    [3:a]atrim=duration=0.5,asetpts=PTS-STARTPTS,volume=0.7,adelay=2900|2900[k2];
    [mus][k1][k2]amix=inputs=3:duration=longest:normalize=0[out]
  " \
  -map 0:v -map "[out]" \
  -c:v copy -c:a aac -b:a 192k -shortest \
  "$VOUT"

echo "✓ Muxed audio → $VOUT"
