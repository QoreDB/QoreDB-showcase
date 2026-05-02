// Publish article to Sanity using the HTTP mutate API.
// Reads body.json (Portable Text) and posts a "post" document, then publishes it.

const https = require('https');
const fs = require('fs');
const crypto = require('crypto');

const PROJECT_ID = 'jnq6wixe';
const DATASET = 'production';
const AUTHOR_ID = 'a5dbd959-f129-457c-a706-4cd289cef15e';
const CATEGORY_ID = '0025a431-45e4-4c47-b0a1-d755239c5f1f'; // Produit

const TITLE = "Le diagramme ER interactif : visualiser un schéma relationnel";
const SLUG = "diagramme-er-interactif-visualiser-schema-relationnel";
const EXCERPT = "Comment QoreDB construit son diagramme entité-relation avec un rendu SVG natif, sans librairie de graphes ni reverse engineering. Un outil pensé pour explorer un schéma existant, pas pour le deviner.";
const PUBLISHED_AT = "2026-04-14T09:00:00.000Z";

const token = process.env.SANITY_TOKEN;
if (!token) {
  console.error('Missing SANITY_TOKEN env var');
  process.exit(2);
}

const body = JSON.parse(fs.readFileSync(__dirname + '/body.json', 'utf8'));

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

function call(path, payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const req = https.request({
      hostname: `${PROJECT_ID}.api.sanity.io`,
      port: 443,
      path,
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

async function main() {
  // 1. Create the document (as a draft).
  const draftId = `drafts.${docId}`;
  const createPayload = {
    mutations: [
      { create: { ...doc, _id: draftId } },
    ],
  };
  console.log('Creating draft...');
  const createRes = await call(`/v2021-03-25/data/mutate/${DATASET}`, createPayload);
  console.log('Create response:', JSON.stringify(createRes, null, 2));

  // 2. Publish: replace draft with the published doc, then delete the draft.
  // The standard way is the createOrReplace + delete on the draft.
  const publishPayload = {
    mutations: [
      { createOrReplace: { ...doc, _id: docId } },
      { delete: { id: draftId } },
    ],
  };
  console.log('Publishing...');
  const publishRes = await call(`/v2021-03-25/data/mutate/${DATASET}`, publishPayload);
  console.log('Publish response:', JSON.stringify(publishRes, null, 2));

  // Output the post ID for downstream use
  console.log('POST_ID=' + docId);
  fs.writeFileSync(__dirname + '/post-id.txt', docId);
}

main().catch((e) => { console.error('Error:', e.message); process.exit(1); });
