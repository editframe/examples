<div align="center">

# Audio Credits

**The music bundled in `audio/` is a production track for this demo; brand & media assets are demo-only.**
Sources documented below. If you replace any file, update this document so
downstream forkers can verify provenance.

The shipped [`output/demo.mp4`](output/demo.mp4) already has this music baked in;
[`add-audio.sh`](add-audio.sh) reproduces it from the composited render.

</div>

---

## Music

### `audio/music-bed.mp3`

| | |
|---|---|
| **Title** | Aluminum and Air |
| **Source** | Production music library (scored for this OLIPOP demo) |
| **Used for** | Single music bed under the full 20s — loudnorm-normalized, 0.6s fade-in, fade-out under the CTA hold |
| **Licensing** | Cleared for this client demo. Confirm licensing before any commercial redistribution. |

This cut is **music only** — there are no sound effects in the 20s timeline.
Replace freely with any royalty-free track ([Pixabay Music](https://pixabay.com/music/),
[Free Music Archive](https://freemusicarchive.org/), [Incompetech](https://incompetech.com/music/royalty-free/)) —
keep the filename `music-bed.mp3` or update [`add-audio.sh`](add-audio.sh).

---

## Brand & media

- **OLIPOP** wordmark, can artwork, 12-pack, and the retro-animation clip in the video
  well (`assets/well-video.mp4`) are property of their respective owner. Used here only
  to demonstrate the Editframe React SDK. Not licensed for redistribution.
- All coded motion graphics (sunbursts, rings, waves, type, the retro frame) are
  original to this demo and covered by the repo's MIT `LICENSE`.
