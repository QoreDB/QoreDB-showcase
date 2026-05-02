// Publish article to Sanity using the HTTP mutate API.
// Reads body.json (Portable Text) and posts a "post" document, then publishes it.
// Run: SANITY_TOKEN=<token> node 2026-04-15-publish.js

const https = require('https');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PROJECT_ID = 'jnq6wixe';
const DATASET = 'production';
const AUTHOR_ID = 'a5dbd959-f129-457c-a706-4cd289cef15e';
const CATEGORY_ID = '0025a431-45e4-4c47-b0a1-d755239c5f1f'; // Produit

const TITLE = "Le diagramme ER interactif : visualiser un schéma relationnel";
const SLUG = "diagramme-er-interactif-visualiser-schema-relationnel";
const EXCERPT = "QoreDB inclut un diagramme ER interactif qui affiche le schéma relationnel d'une base directement depuis ses métadonnées. Voici comment il fonctionne techniquement.";
const PUBLISHED_AT = "2026-04-15T09:00:00.000Z";

const token = process.env.SANITY_TOKEN;
if (!token) {
  console.error('Missing SANITY_TOKEN env var');
  console.error('Usage: SANITY_TOKEN=<token> node 2026-04-15-publish.js');
  process.exit(2);
}

// Use the body from the April 14 pending article (same content)
const bodyPath = path.join(__dirname, '2026-04-14-body.json');
const body = JSON.parse(fs.readFileSync(bodyPath, 'utf8'));

const docId = crypto.randomUUID();

const doc = {
  _id: docId,
  _type: 'post',
  title: TITLE,
  slug: { _type: 'slug', current: SLUG },
  excerpt: EXCERPT,
  publishedAt: PUBLISHED_AT,
  author: { _type: 'reference', _ref: AUTHOR_ID },
  categories: [
    { _type: 'reference', _ref: CATEGORY_ID, _key: 'cat1' },
  ],
  body,
};

function call(urlPath, payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const req = https.request({
      hostname: `${PROJECT_ID}.api.sanity.io`,
      port: 443,
      path: urlPath,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
    }, (res) => {
      let chunks = '';
      res.on('data', (c) => { chunks += c; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(chunks));
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${chunks}`));
        }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function uploadCover(postId) {
  const coverPath = path.join(__dirname, '2026-04-15-cover.png');
  if (!fs.existsSync(coverPath)) {
    console.log('Cover image not found, skipping upload.');
    return;
  }
  const sharp = require(path.join(__dirname, '../../node_modules/sharp'));
  const pngBuffer = fs.readFileSync(coverPath);

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: `${PROJECT_ID}.api.sanity.io`,
      port: 443,
      path: `/v2021-03-25/assets/images/${DATASET}`,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'image/png',
        'Content-Length': pngBuffer.length,
      },
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode >= 200 && res.statusCode < 300) resolve(parsed);
          else reject(new Error(`Upload error ${res.statusCode}: ${data}`));
        } catch (e) { reject(new Error(`Failed to parse: ${data}`)); }
      });
    });
    req.on('error', reject);
    req.write(pngBuffer);
    req.end();
  }).then(async (uploadResult) => {
    const assetId = uploadResult.document._id;
    console.log(`Uploaded cover asset: ${assetId}`);

    const patchPayload = JSON.stringify({
      mutations: [{ patch: { id: postId, set: { mainImage: { _type: 'image', asset: { _type: 'reference', _ref: assetId } } } } }],
    });
    return new Promise((resolve, reject) => {
      const req2 = https.request({
        hostname: `${PROJECT_ID}.api.sanity.io`,
        port: 443,
        path: `/v2021-03-25/data/mutate/${DATASET}`,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(patchPayload),
        },
      }, (res) => {
        let data2 = '';
        res.on('data', (c) => { data2 += c; });
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) resolve(JSON.parse(data2));
          else reject(new Error(`Patch error ${res.statusCode}: ${data2}`));
        });
      });
      req2.on('error', reject);
      req2.write(patchPayload);
      req2.end();
    });
  });
}

async function main() {
  const draftId = `drafts.${docId}`;

  // 1. Create the draft
  console.log('Creating draft...');
  const createPayload = { mutations: [{ create: { ...doc, _id: draftId } }] };
  const createRes = await call(`/v2021-03-25/data/mutate/${DATASET}`, createPayload);
  console.log('Draft created:', JSON.stringify(createRes.results, null, 2));

  // 2. Publish: createOrReplace + delete draft
  console.log('Publishing...');
  const publishPayload = {
    mutations: [
      { createOrReplace: { ...doc, _id: docId } },
      { delete: { id: draftId } },
    ],
  };
  const publishRes = await call(`/v2021-03-25/data/mutate/${DATASET}`, publishPayload);
  console.log('Published:', JSON.stringify(publishRes.results, null, 2));
  console.log('POST_ID=' + docId);

  fs.writeFileSync(path.join(__dirname, 'post-id.txt'), docId);

  // 3. Upload cover image
  try {
    await uploadCover(docId);
    console.log('Cover image uploaded and linked.');
  } catch (err) {
    console.warn('Cover upload failed (non-fatal):', err.message);
  }
}

main().catch((e) => { console.error('Error:', e.message); process.exit(1); });
