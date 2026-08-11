<div align="center">

# Audio Credits

**The music bundled in `src/assets/` is a production track for this demo; brand & media assets are demo-only.**
Sources documented below. If you replace any file, update this document so
downstream forkers can verify provenance.

The shipped [`output/demo.mp4`](output/demo.mp4) already has this music baked in;
`src/assets/olipop-demo-music-bed.mp3` (referenced natively via `<Audio>` in `src/Video.tsx`) already
has the fades/normalization baked in.

</div>

---

## Music

### `src/assets/olipop-demo-music-bed.mp3`

| | |
|---|---|
| **Title** | Aluminum and Air |
| **Source** | Production music library (scored for this OLIPOP demo) |
| **Used for** | Single music bed under the full 20s — loudnorm-normalized, 0.6s fade-in, fade-out under the CTA hold |
| **Licensing** | Cleared for this client demo. Confirm licensing before any commercial redistribution. |

This cut is **music only** — there are no sound effects in the 20s timeline.
Replace freely with any royalty-free track ([Pixabay Music](https://pixabay.com/music/),
[Free Music Archive](https://freemusicarchive.org/), [Incompetech](https://incompetech.com/music/royalty-free/)) —
bake fades/normalization in locally with FFmpeg (audio-only, no video) before dropping
the replacement at `src/assets/olipop-demo-music-bed.mp3`, or update the `MUSIC` constant in
`src/Video.tsx` if you rename it.

---

## Brand & media

- **OLIPOP** wordmark, can artwork, 12-pack, and the retro-animation clip in the video
  well (`assets/well-video.mp4`) are property of their respective owner. Used here only
  to demonstrate the Editframe React SDK. Not licensed for redistribution.
- All coded motion graphics (sunbursts, rings, waves, type, the retro frame) are
  original to this demo and covered by the repo's MIT `LICENSE`.
