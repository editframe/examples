# audio/

This directory documents the audio pass for the OpenClaw demo.

The runtime audio asset lives at `public/audio/openclaw-score.m4a` so Vite and
Editframe can serve it at `/audio/openclaw-score.m4a` during preview and render.
The render script applies that score to the final MP4 after the visual pass.

The score is original synthesized audio created for this example. No external
music, loops, or samples are bundled.
