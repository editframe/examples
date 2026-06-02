#!/bin/bash
# claude-office — Music: Optimal_Flow + keyboard SFX on the typed PROMPT and a
# click SFX on the SEND button.
#   Scene2 logo press-pop: POP_PRESS_START 2300 (+5000 scene) -> global 7300ms.
#     The Outlook logo compresses then pops ("gets clicked", no cursor) — user asked
#     for a click SFX here as an explicit exception.
#   Scene3 starts global 8000ms:
#     prompt typing : TYPE_START 3000 (+1400)  -> global 11000ms, 1.4s
#     send click    : CLICK_START 5900         -> global 13900ms
#   Scene5 "response" typing is the AI replying -> NO keyboard SFX (per rules).
set -e
cd "$(dirname "$0")"

VIN="output/demo-silent.mp4"
VOUT="output/demo.mp4"
MUS="audio/music.mp3"; KBD="audio/keyboard.wav"; CLK="audio/click.mp3"
for f in "$VIN" "$MUS" "$KBD" "$CLK"; do [ -f "$f" ] || { echo "MISSING $f"; exit 1; }; done

# Video ≈ 26.05s. Bed loudnorm -26 LUFS, fade in 0.4s, fade out last 1.8s.
ffmpeg -y -hide_banner -v error \
  -i "$VIN" \
  -i "$MUS" \
  -i "$KBD" \
  -i "$CLK" \
  -i "$CLK" \
  -filter_complex "
    [1:a]atrim=duration=24.6,asetpts=PTS-STARTPTS,loudnorm=I=-26:TP=-4:LRA=7,aresample=48000,afade=t=in:st=0:d=0.4,afade=t=out:st=22.75:d=1.8[mus];
    [2:a]atrim=duration=1.4,asetpts=PTS-STARTPTS,volume=0.7,adelay=9500|9500[k1];
    [3:a]atrim=start=0.6:duration=0.3,asetpts=PTS-STARTPTS,volume=2.2,adelay=5800|5800[c0];
    [4:a]atrim=start=0.6:duration=0.3,asetpts=PTS-STARTPTS,volume=2.2,adelay=12400|12400[c1];
    [mus][k1][c0][c1]amix=inputs=4:duration=longest:normalize=0[out]
  " \
  -map 0:v -map "[out]" \
  -c:v copy -c:a aac -b:a 192k -shortest \
  "$VOUT"

echo "✓ Muxed audio → $VOUT"
