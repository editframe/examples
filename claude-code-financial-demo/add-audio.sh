#!/bin/bash
# claude-code-financial — Music (Leftover_Morning_Light) + per-BUMP scroll ticks.
# The pill column scrolls (inOutQuart) 5350→8400ms; each of the 11 pills crosses
# center at scrollT_i=(160+108*i)/1240, inverted through the easing to time:
#   6437 6586 6696 6784 6858 6927 7007 7103 7229 7415 8400  (ms)
# A SINGLE tick is extracted from the menu-scroll mp3 (sharp tick at file 3.39s)
# and stamped at each bump. Because the bumps are slow→fast→slow, the ticks blur
# into a rapid scroll through the fast middle and become distinct at the ends, then
# HARD STOP on the final settle (8400) — no fade tail. Matches each box bump.
set -e
cd "$(dirname "$0")"

VIN="output/demo-silent.mp4"
VOUT="output/demo.mp4"
MUS="audio/music.mp3"
TICK="audio/menu-scroll.mp3"
for f in "$VIN" "$MUS" "$TICK"; do [ -f "$f" ] || { echo "MISSING $f"; exit 1; }; done

ffmpeg -y -hide_banner -v error \
  -i "$VIN" \
  -i "$MUS" \
  -i "$TICK" \
  -filter_complex "
    [1:a]atrim=duration=23.1,asetpts=PTS-STARTPTS,loudnorm=I=-26:TP=-4:LRA=7,aresample=48000,afade=t=in:st=0:d=0.4,afade=t=out:st=21.2:d=1.8[mus];
    [2:a]atrim=start=3.413:duration=0.05,asetpts=PTS-STARTPTS,afade=t=out:st=0.04:d=0.01,volume=1.0,asplit=11[t0][t1][t2][t3][t4][t5][t6][t7][t8][t9][t10];
    [t0]adelay=6422|6422[d0];
    [t1]adelay=6571|6571[d1];
    [t2]adelay=6681|6681[d2];
    [t3]adelay=6769|6769[d3];
    [t4]adelay=6843|6843[d4];
    [t5]adelay=6912|6912[d5];
    [t6]adelay=6992|6992[d6];
    [t7]adelay=7088|7088[d7];
    [t8]adelay=7214|7214[d8];
    [t9]adelay=7400|7400[d9];
    [t10]adelay=7815|7815[d10];
    [mus][d0][d1][d2][d3][d4][d5][d6][d7][d8][d9][d10]amix=inputs=12:duration=longest:normalize=0[out]
  " \
  -map 0:v -map "[out]" \
  -c:v copy -c:a aac -b:a 192k -shortest \
  "$VOUT"

echo "✓ Muxed audio → $VOUT"
