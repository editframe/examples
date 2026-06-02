#!/bin/bash
# vercel-knowledge-base — NO MUSIC (per spec). SFX only: keyboard on the typed
# Ask-AI prompt + click on the 3 real clicks. The AI's streaming answer gets NO
# keyboard SFX (it's the AI responding, not typing).
#   Scene1 filter-button click : CLICK_BTN_TIME 9200  (global)
#   Scene1 Sandbox click        : SANDBOX_CLICK 9900   (global)
#   Scene5 prompt typing        : typewriter @1500 (+16500 scene) -> global 18000ms, 1.5s
#   Scene5 thumbs-up click      : TU_CLICK 13060 (+16500 scene)   -> global 29560ms
# click.mp3 has 0.6s leading silence — trim FROM the transient (start=0.6).
# A silent anullsrc base (input 5) of the full video length anchors the mix so the
# audio track spans the whole video (no trailing truncation).
set -e
cd "$(dirname "$0")"

VIN="output/demo-silent.mp4"; VOUT="output/demo.mp4"
KBD="audio/keyboard.wav"; CLK="audio/click.mp3"
for f in "$VIN" "$KBD" "$CLK"; do [ -f "$f" ] || { echo "MISSING $f"; exit 1; }; done

ffmpeg -y -hide_banner -v error \
  -i "$VIN" -i "$CLK" -i "$CLK" -i "$KBD" -i "$CLK" \
  -f lavfi -t 30.06 -i anullsrc=r=48000:cl=stereo \
  -filter_complex "
    [1:a]atrim=start=0.6:duration=0.3,asetpts=PTS-STARTPTS,volume=2.2,adelay=9200|9200[c1];
    [2:a]atrim=start=0.6:duration=0.3,asetpts=PTS-STARTPTS,volume=2.2,adelay=9900|9900[c2];
    [3:a]atrim=duration=1.5,asetpts=PTS-STARTPTS,volume=0.7,adelay=18000|18000[k1];
    [4:a]atrim=start=0.6:duration=0.3,asetpts=PTS-STARTPTS,volume=2.2,adelay=29560|29560[c3];
    [5:a][c1][c2][k1][c3]amix=inputs=5:duration=first:normalize=0[out]
  " \
  -map 0:v -map "[out]" \
  -c:v copy -c:a aac -b:a 192k -shortest \
  "$VOUT"

echo "✓ Muxed audio → $VOUT"
