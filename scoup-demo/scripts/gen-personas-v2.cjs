// Regen Strategist + Editor so they match the cohesive pencil-and-yellow look.
const { fal } = require('@fal-ai/client');
const fs = require('fs');
const path = require('path');
const https = require('https');

process.env.FAL_KEY = '2f87e0a8-489e-4cc8-a3db-a62bf903ff42:9f1acdef8dd6024a49b2fd5ceffd3e8f';

const OUT = path.join(__dirname, '..', 'src', 'assets', 'personas');

const STYLE = 'minimalist editorial portrait sketch, fine pencil and ink line work on a slightly textured dark navy background, monochrome charcoal grey skin and clothing with very subtle paint shading, single bold scoup-yellow #F5C518 accent stroke as one specific mark, soft chalk halo behind the head, painterly newspaper editorial illustration, square format, head and shoulders, looking forward, calm professional newsroom energy, NO text, NO logo, NO watermark';

const personas = [
  {
    filename: 'strategist.png',
    prompt: `${STYLE}. A distinguished older man in his late 50s with neatly combed silver hair, a thoughtful confident expression. Sketched in pencil and ink line work, monochrome charcoal grey, dark navy background. A single bold scoup-yellow accent brush stroke crosses his lapel diagonally. Calm composed senior strategist.`,
  },
  {
    filename: 'editor.png',
    prompt: `${STYLE}. A woman in her mid-30s with chin-length dark wavy hair and a serious editorial gaze, slight smile. Sketched in pencil and ink line work, monochrome charcoal grey skin and shirt, dark navy background. A single bold scoup-yellow accent brush stroke goes across her collar from left shoulder down. Decisive senior editor.`,
  },
];

function dl(url, dest) {
  return new Promise((res, rej) => {
    const f = fs.createWriteStream(dest);
    const h = (r) => {
      if (r.statusCode >= 300 && r.statusCode < 400 && r.headers.location) {
        https.get(r.headers.location, h).on('error', rej); return;
      }
      r.pipe(f); f.on('finish', () => { f.close(); res(); });
    };
    https.get(url, h).on('error', (e) => { fs.unlink(dest, () => {}); rej(e); });
  });
}

(async () => {
  for (const p of personas) {
    console.log(`Generating: ${p.filename}`);
    try {
      const r = await fal.subscribe('fal-ai/nano-banana-2', {
        input: {
          prompt: p.prompt,
          aspect_ratio: '1:1',
          resolution: '2K',
          output_format: 'png',
          num_images: 1,
          safety_tolerance: 5,
          thinking_level: 'minimal',
        },
        logs: false,
      });
      const tmp = path.join(OUT, p.filename + '.tmp');
      await dl(r.data.images[0].url, tmp);
      // Resize to 400px to match other personas
      const { execSync } = require('child_process');
      execSync(`ffmpeg -y -v error -i "${tmp}" -vf "scale=400:400" "${path.join(OUT, p.filename)}"`);
      fs.unlinkSync(tmp);
      console.log(`  ✓ ${p.filename}`);
    } catch (e) {
      console.error(`  ✗ ${p.filename}: ${e.message}`);
    }
  }
})();
