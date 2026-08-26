# Win11React — Intro Film

A 20-second landscape showreel for [Win11React](https://win11.blueedge.me), rebuilt as an Editframe composition.

Win11React is an independent open-source recreation of the Windows 11 desktop experience on the web — built with React, SCSS, and JavaScript. This film is a snappy, interaction-led tour of that experience: it boots, signs in, opens the Start menu, cascades a few app windows, then flips the whole desktop into **dark mode** with a circular reveal before landing on a project card.

The interface is recreated in React/CSS for crisp rendering at 1920×1080, driven entirely by scoped CSS `@keyframes` (no per-frame JS), and cut to a single music bed.

## Beat plan

Eight `mode="fixed"` scenes played by one `mode="sequence"` group (hard cuts), all sharing the same bloom-desktop geometry so the cuts read as one continuous machine:

| # | Scene | Time | Beat |
|---|---|---|---|
| 1 | Lock | 0–2.2s | Boot mark + big clock → swipe-up unlock |
| 2 | Sign in | 2.2–3.3s | "Blue Edge" avatar, cursor clicks **Sign in** (ripple) |
| 3 | Desktop | 3.3–5.6s | Icons cascade in, taskbar rises, welcome toast |
| 4 | Start | 5.6–8.0s | Cursor hits Start, menu spring-opens |
| 5 | Montage | 8.0–11.4s | Explorer / Edge / Terminal windows snap in, cursor darts between them |
| 6 | **Dark mode** | 11.4–14.6s | Personalization panel → cursor flips to **Dark** → circular light→dark reveal (hero beat) |
| 7 | Spec | 14.6–17.2s | React · SCSS · JavaScript · PWA · Open Source · Creative Commons chips fly in |
| 8 | Outro | 17.2–20.0s | Logo, "Windows, reimagined for the web.", `win11.blueedge.me` |

## Render

```bash
npm run render:win11react-demo
```

Output: `win11react-demo/output/demo.mp4`.

## Media

`src/assets/reference/` contains the wallpaper, lock-screen image, boot mark, and application icons used by the composition. The dark-mode look is derived from the same light "Bloom" wallpaper via CSS. `src/assets/win11react-demo-music-bed.mp3` is the music bed. See [CREDITS.md](CREDITS.md) for source URLs and attribution notes.

Win11React is an independent open-source project by Blue Edge. This film is an independent showcase and is not affiliated with Microsoft.
