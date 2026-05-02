const sharp = require('sharp');
const https = require('https');
const fs = require('fs');

const WIDTH = 2400;
const HEIGHT = 1260;

const CATEGORY_COLORS = {
  'Architecture': '#3B82F6',
  'Security': '#EF4444',
  'Open Source': '#10B981',
  'Produit': '#8B5CF6',
  'Updates': '#F59E0B',
  'Vision': '#06B6D4',
};

function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

function wrapText(text, maxCharsPerLine) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';
  for (const word of words) {
    if ((currentLine + ' ' + word).trim().length > maxCharsPerLine) {
      if (currentLine) lines.push(currentLine.trim());
      currentLine = word;
    } else {
      currentLine = currentLine ? currentLine + ' ' + word : word;
    }
  }
  if (currentLine) lines.push(currentLine.trim());
  return lines;
}

function generateSVG(title, subtitle, category) {
  const catColor = CATEGORY_COLORS[category] || '#3B82F6';
  const titleLines = wrapText(title, 35);
  const titleFontSize = titleLines.length > 2 ? 64 : 72;
  const titleLineHeight = titleFontSize * 1.25;
  const titleStartY = 420 + (3 - Math.min(titleLines.length, 3)) * (titleLineHeight / 2);

  const titleSvg = titleLines.slice(0, 4).map((line, i) =>
    `<text x="120" y="${titleStartY + i * titleLineHeight}" font-family="system-ui, -apple-system, 'Segoe UI', sans-serif" font-size="${titleFontSize}" font-weight="700" fill="white" letter-spacing="-1">${escapeXml(line)}</text>`
  ).join('\n    ');

  const subtitleLines = wrapText(subtitle, 70);
  const subtitleStartY = titleStartY + titleLines.length * titleLineHeight + 40;
  const subtitleSvg = subtitleLines.slice(0, 3).map((line, i) =>
    `<text x="120" y="${subtitleStartY + i * 36}" font-family="system-ui, -apple-system, 'Segoe UI', sans-serif" font-size="26" fill="#94A3B8" letter-spacing="0.2">${escapeXml(line)}</text>`
  ).join('\n    ');

  return `<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0F172A;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1E293B;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:${catColor};stop-opacity:0.6" />
      <stop offset="100%" style="stop-color:${catColor};stop-opacity:0" />
    </linearGradient>
    <linearGradient id="glow" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:${catColor};stop-opacity:0.15" />
      <stop offset="100%" style="stop-color:${catColor};stop-opacity:0" />
    </linearGradient>
    <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
      <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#1E293B" stroke-width="0.5" opacity="0.5"/>
    </pattern>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)" />
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#grid)" opacity="0.4" />
  <rect x="0" y="0" width="${WIDTH}" height="400" fill="url(#glow)" />
  <rect x="0" y="0" width="6" height="${HEIGHT}" fill="${catColor}" />
  <rect x="6" y="0" width="${WIDTH}" height="3" fill="url(#accent)" />
  <circle cx="${WIDTH - 200}" cy="200" r="300" fill="${catColor}" opacity="0.03" />
  <circle cx="${WIDTH - 100}" cy="350" r="200" fill="${catColor}" opacity="0.04" />
  <text x="120" y="180" font-family="system-ui, -apple-system, 'Segoe UI', sans-serif" font-size="42" font-weight="800" fill="white" letter-spacing="2">
    <tspan fill="${catColor}">Q</tspan><tspan fill="white">ore</tspan><tspan fill="${catColor}">DB</tspan>
  </text>
  <circle cx="330" cy="170" r="4" fill="#475569" />
  <rect x="350" y="150" width="${category.length * 16 + 40}" height="38" rx="19" fill="${catColor}" opacity="0.15" />
  <text x="${350 + (category.length * 16 + 40) / 2}" y="175" font-family="system-ui, -apple-system, 'Segoe UI', sans-serif" font-size="20" font-weight="600" fill="${catColor}" text-anchor="middle" letter-spacing="1">${escapeXml(category.toUpperCase())}</text>
  ${titleSvg}
  ${subtitleSvg}
  <rect x="120" y="${HEIGHT - 120}" width="200" height="2" fill="#334155" />
  <text x="120" y="${HEIGHT - 80}" font-family="system-ui, -apple-system, 'Segoe UI', sans-serif" font-size="20" fill="#64748B" letter-spacing="0.5">blog.qoredb.com</text>
  <rect x="${WIDTH - 320}" y="${HEIGHT - 100}" width="200" height="2" fill="${catColor}" opacity="0.3" />
</svg>`;
}

async function uploadToSanity(pngBuffer, token, projectId, dataset) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: `${projectId}.api.sanity.io`,
      port: 443,
      path: `/v2021-03-25/assets/images/${dataset}`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'image/png',
        'Content-Length': pngBuffer.length,
      },
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode >= 200 && res.statusCode < 300) resolve(parsed);
          else reject(new Error(`Sanity API error ${res.statusCode}: ${data}`));
        } catch (e) { reject(new Error(`Failed to parse: ${data}`)); }
      });
    });
    req.on('error', reject);
    req.write(pngBuffer);
    req.end();
  });
}

async function patchDocument(postId, imageAssetId, token, projectId, dataset) {
  const body = JSON.stringify({
    mutations: [{ patch: { id: postId, set: { mainImage: { _type: 'image', asset: { _type: 'reference', _ref: imageAssetId } } } } }],
  });
  return new Promise((resolve, reject) => {
    const options = {
      hostname: `${projectId}.api.sanity.io`,
      port: 443,
      path: `/v2021-03-25/data/mutate/${dataset}`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode >= 200 && res.statusCode < 300) resolve(parsed);
          else reject(new Error(`Sanity API error ${res.statusCode}: ${data}`));
        } catch (e) { reject(new Error(`Failed to parse: ${data}`)); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  const args = process.argv.slice(2);
  const getArg = (name) => { const idx = args.indexOf(`--${name}`); return idx !== -1 ? args[idx + 1] : null; };

  const title = getArg('title');
  const subtitle = getArg('subtitle') || '';
  const category = getArg('category') || 'Architecture';
  const output = getArg('output') || '/tmp/blog-cover.png';
  const postId = getArg('post-id');
  const upload = args.includes('--upload');
  const token = process.env.SANITY_TOKEN;
  const projectId = getArg('project-id') || 'jnq6wixe';
  const dataset = getArg('dataset') || 'production';

  if (!title) {
    console.error('Usage: node generate-blog-image-sharp.js --title "..." [--subtitle "..."] [--category "..."] [--output file.png] [--upload --post-id ID]');
    process.exit(1);
  }

  console.log(`Generating cover for: "${title}" [${category}]`);
  const svg = generateSVG(title, subtitle, category);
  const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();
  fs.writeFileSync(output, pngBuffer);
  console.log(`Saved to ${output} (${(pngBuffer.length / 1024).toFixed(0)} KB)`);

  if (upload && token && postId) {
    console.log(`Uploading to Sanity...`);
    const uploadResult = await uploadToSanity(pngBuffer, token, projectId, dataset);
    const assetId = uploadResult.document._id;
    console.log(`Uploaded asset: ${assetId}`);
    console.log(`Patching post ${postId}...`);
    await patchDocument(postId, assetId, token, projectId, dataset);
    console.log(`Done! Post ${postId} now has a cover image.`);
  } else if (upload) {
    if (!token) console.error('Missing SANITY_TOKEN env var');
    if (!postId) console.error('Missing --post-id');
    process.exit(1);
  }
}

main().catch((err) => { console.error('Error:', err.message); process.exit(1); });
