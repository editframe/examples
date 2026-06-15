"""Read wells.json (fallback to defaults), write rounded-rect alpha masks sized to the
actual WELL_A / WELL_B rects, and print the coords for the bash composite in add-audio.sh."""
import sys, json, os

from PIL import Image, ImageDraw

root = sys.argv[1] if len(sys.argv) > 1 else "."
d = {
    "WELL_A": {"x": 220, "y": 540, "w": 640, "h": 1060, "r": 24},
    "WELL_B": {"x": 160, "y": 1020, "w": 760, "h": 600, "r": 20},
}
p = os.path.join(root, "wells.json")
if os.path.exists(p):
    try:
        j = json.load(open(p))
        for k in ("WELL_A", "WELL_B"):
            if k in j and isinstance(j[k], dict):
                d[k].update(j[k])
    except Exception as e:
        sys.stderr.write(f"wells.json parse fail ({e}) - using defaults\n")

for k, suf in (("WELL_A", "A"), ("WELL_B", "B")):
    w, h, r = int(d[k]["w"]), int(d[k]["h"]), int(d[k]["r"])
    m = Image.new("L", (w, h), 0)
    ImageDraw.Draw(m).rounded_rectangle([0, 0, w - 1, h - 1], radius=r, fill=255)
    m.save(os.path.join(root, f"_mask_{suf}.png"))

a, b = d["WELL_A"], d["WELL_B"]
print(a["x"], a["y"], a["w"], a["h"], b["x"], b["y"], b["w"], b["h"])
