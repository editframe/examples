# Ramp Labs

A 25-second product story for Ramp Labs — charts, invoices, a live investigation.

**Built with the [Editframe](https://editframe.com) React SDK** · 1920×1080 · 60fps

---

## Quick start

From the examples repo root:

```bash
npm install
npm start
npm run render:ramplabs-demo  # -> ramplabs-demo/output/demo.mp4
```

The music bed plays as a native `<Audio>` element on the composition timeline — no post-render mux step. Audio lives in `src/assets/` — see [CREDITS.md](CREDITS.md) for license details.

---

## Scene timeline

| Time | Scene | What happens |
|---|---|---|
| `0 – 3.9s` | **InvoiceScene** | AI invoice volume grows on a chart |
| `3.9 – 7.3s` | **SpendScene** | Undifferentiated spending piles up |
| `7.3 – 12.7s` | **SeparationScene** | The work is separated into vectors and cards |
| `12.7 – 18.7s` | **InvestigationScene** | An investigation example plays through |
| `18.7 – 25.0s` | **WorkItemsScene** | Work-item descriptions and closing message |

---

## License

[MIT](LICENSE) — free for commercial use, no attribution required. Bundled audio and brand imagery retain their own licenses (documented in [`CREDITS.md`](CREDITS.md)).
