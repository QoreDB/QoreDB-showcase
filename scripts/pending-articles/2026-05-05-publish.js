// Publish article to Sanity using the HTTP mutate API.
// Reads body.json (Portable Text) and posts a "post" document, then publishes it.
// Run: SANITY_TOKEN=<token> node 2026-05-05-publish.js

const https = require('https');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PROJECT_ID = 'jnq6wixe';
const DATASET = 'production';
const AUTHOR_ID = 'a5dbd959-f129-457c-a706-4cd289cef15e';
const CATEGORY_ID = '30e9bc1f-e363-44b1-a3dd-cf787160b341'; // Security

const TITLE = "Rédaction automatique : pourquoi aucun secret ne sort dans les logs";
const SLUG = "redaction-automatique-secrets-logs";
const EXCERPT = "QoreDB applique la rédaction au niveau du type Rust et au niveau de la requête, avant chaque point de persistance. Ce qui sort n'a plus de mots de passe, ni en mémoire, ni sur disque.";
const PUBLISHED_AT = "2026-05-05T09:00:00.000Z";

const token = process.env.SANITY_TOKEN;
if (!token) {
  console.error('Missing SANITY_TOKEN env var');
  console.error('Usage: SANITY_TOKEN=<token> node 2026-05-05-publish.js');
  process.exit(2);
}

const bodyPath = path.join(__dirname, '2026-05-05-body.json');
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
  const coverPath = path.join(__dirname, '2026-05-05-cover.png');
  if (!fs.existsSync(coverPath)) {
    console.log('Cover image not found, skipping upload.');
    return;
  }
  const pngBuffer = fs.readFileSync(coverPath);
  const uploadResult = await new Promise((resolve, reject) => {
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
  });
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
}

async function main() {
  const draftId = `drafts.${docId}`;

  console.log('Creating draft...');
  const createPayload = { mutations: [{ create: { ...doc, _id: draftId } }] };
  const createRes = await call(`/v2021-03-25/data/mutate/${DATASET}`, createPayload);
  console.log('Draft created:', JSON.stringify(createRes.results, null, 2));

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

  try {
    await uploadCover(docId);
    console.log('Cover image uploaded and linked.');
  } catch (err) {
    console.warn('Cover upload failed (non-fatal):', err.message);
  }
}

main().catch((e) => { console.error('Error:', e.message); process.exit(1); });
