#!/bin/bash
# cursor-cloud-agents — Music: LowTide LATER segment (starts 66s in, so it differs
# from clerk-cli which uses the LowTide intro) + ONE click SFX on the "Start Agent"
# button. No keyboard SFX: the Scene1 chatbox shows a static placeholder, nothing
# is typed.
#   Scene4 "Start Agent" click : CLICK 1500ms (+6500 scene) -> global 8000ms
# click.mp3 has 0.6s leading silence — trim FROM the transient (start=0.6).
set -e
cd "$(dirname "$0")"

VIN="output/demo-silent.mp4"; VOUT="output/demo.mp4"
MUS="audio/music.mp3"; CLK="audio/click.mp3"
for f in "$VIN" "$MUS" "$CLK"; do [ -f "$f" ] || { echo "MISSING $f"; exit 1; }; done

# Video ≈ 20.03s. Music = LowTide from 66s, loudnorm -26 LUFS, fade in/out.
ffmpeg -y -hide_banner -v error \
  -i "$VIN" -i "$MUS" -i "$CLK" \
  -filter_complex "
    [1:a]atrim=start=66:duration=20.1,asetpts=PTS-STARTPTS,loudnorm=I=-26:TP=-4:LRA=7,aresample=48000,afade=t=in:st=0:d=0.4,afade=t=out:st=18.25:d=1.8[mus];
    [2:a]atrim=start=0.6:duration=0.3,asetpts=PTS-STARTPTS,volume=2.2,adelay=8000|8000[c1];
    [mus][c1]amix=inputs=2:duration=longest:normalize=0[out]
  " \
  -map 0:v -map "[out]" \
  -c:v copy -c:a aac -b:a 192k -shortest \
  "$VOUT"

echo "✓ Muxed audio → $VOUT"
