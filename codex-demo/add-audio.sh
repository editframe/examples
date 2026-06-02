#!/bin/bash
# codex (CloudTicTacToe) — Music: After_the_Last_Pour + keyboard SFX on the typed
# prompt + click SFX on the 3 real button/cell clicks. NO SFX on the agent's
# streaming "Working…/Called N tools" output (that's the AI responding).
#   Scene2 prompt typing : TYPE_START 800  (+2500 scene)  -> global 3300ms, ~1.2s
#   Scene3 Send click     : CLICK_START 200 (+4500 scene)  -> global 4700ms
#   Scene6 RUN click      : CLICK_T 760     (+13000 scene) -> global 13760ms
#   Scene8 cell click      : CLICK_T 1000    (+17500 scene) -> global 18500ms (center square)
# click.mp3 has 0.6s of leading silence — trim FROM the transient (start=0.6).
set -e
cd "$(dirname "$0")"

VIN="output/demo-silent.mp4"; VOUT="output/demo.mp4"
MUS="audio/music.mp3"; KBD="audio/keyboard.wav"; CLK="audio/click.mp3"
for f in "$VIN" "$MUS" "$KBD" "$CLK"; do [ -f "$f" ] || { echo "MISSING $f"; exit 1; }; done

# Video ≈ 22.04s. Bed loudnorm -26 LUFS, fade in 0.4s, fade out last 1.8s.
ffmpeg -y -hide_banner -v error \
  -i "$VIN" -i "$MUS" -i "$KBD" -i "$CLK" -i "$CLK" -i "$CLK" \
  -filter_complex "
    [1:a]atrim=duration=22.1,asetpts=PTS-STARTPTS,loudnorm=I=-26:TP=-4:LRA=7,aresample=48000,afade=t=in:st=0:d=0.4,afade=t=out:st=20.25:d=1.8[mus];
    [2:a]atrim=duration=1.2,asetpts=PTS-STARTPTS,volume=0.7,adelay=3300|3300[k1];
    [3:a]atrim=start=0.6:duration=0.3,asetpts=PTS-STARTPTS,volume=2.2,adelay=4700|4700[c1];
    [4:a]atrim=start=0.6:duration=0.3,asetpts=PTS-STARTPTS,volume=2.2,adelay=13760|13760[c2];
    [5:a]atrim=start=0.6:duration=0.3,asetpts=PTS-STARTPTS,volume=2.2,adelay=18500|18500[c3];
    [mus][k1][c1][c2][c3]amix=inputs=5:duration=longest:normalize=0[out]
  " \
  -map 0:v -map "[out]" \
  -c:v copy -c:a aac -b:a 192k -shortest \
  "$VOUT"

echo "✓ Muxed audio → $VOUT"
