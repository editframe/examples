// Generate 5 abstract persona marks via fal.ai nano-banana 2.
// Each is a stylized geometric portrait — same art direction across the set.
const { fal } = require('@fal-ai/client');
const fs = require('fs');
const path = require('path');
const https = require('https');

process.env.FAL_KEY = '2f87e0a8-489e-4cc8-a3db-a62bf903ff42:9f1acdef8dd6024a49b2fd5ceffd3e8f';

const OUT = path.join(__dirname, '..', 'src', 'assets', 'personas');
fs.mkdirSync(OUT, { recursive: true });

const STYLE = 'minimalist abstract editorial portrait, geometric line art with subtle paint texture, monochrome charcoal grey with a single yellow accent stroke, soft dark navy background, transparent halo, painterly editorial illustration, square format, no text, no logo, no watermark, head and shoulders, looking forward, calm professional energy';

const personas = [
  { filename: 'researcher.png', prompt: `${STYLE}. A young woman with short bob hair and round glasses, the lens catching a glow of warm yellow light, contemplative expression.` },
  { filename: 'analyst.png',    prompt: `${STYLE}. A young woman with short curly hair, single yellow accent on the cheek, intense focused gaze.` },
  { filename: 'journalist.png', prompt: `${STYLE}. A man with a short beard holding a pen near his lips, single yellow accent stroke on the pen tip, thoughtful interview pose.` },
  { filename: 'strategist.png', prompt: `${STYLE}. A distinguished older man with silver hair and a calm composed expression, single yellow accent stroke on the lapel.` },
  { filename: 'editor.png',     prompt: `${STYLE}. A woman with auburn hair pulled back, single yellow accent stroke at the collar, decisive expression.` },
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
      await dl(r.data.images[0].url, path.join(OUT, p.filename));
      console.log(`  ✓ ${p.filename}`);
    } catch (e) {
      console.error(`  ✗ ${p.filename}: ${e.message}`);
    }
  }
})();
