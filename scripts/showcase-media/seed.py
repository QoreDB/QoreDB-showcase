"""Create synthetic SQLite data and an isolated QoreDB encrypted vault for capture.
Requires Python 3 + PyNaCl. This fixture never reads an existing QoreDB profile.
"""
import base64
import json
import os
from pathlib import Path
import sqlite3
from nacl.pwhash import argon2id
from nacl.bindings import crypto_aead_xchacha20poly1305_ietf_encrypt

root = Path('/tmp/qore-showcase-media')
(root / 'config').mkdir(parents=True, exist_ok=True)
(root / 'data').mkdir(exist_ok=True)
database = sqlite3.connect(root / 'atelier.db')
database.executescript('''
CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY, name TEXT NOT NULL, environment TEXT NOT NULL,
  status TEXT NOT NULL, region TEXT NOT NULL, deployments INTEGER NOT NULL,
  updated_at TEXT NOT NULL
);
DELETE FROM projects;
''')
rows = [
    (1, 'Atlas', 'production', 'healthy', 'eu-west', 128, '2026-09-16'),
    (2, 'Forma', 'production', 'healthy', 'eu-west', 96, '2026-09-16'),
    (3, 'Orbit', 'staging', 'review', 'us-east', 42, '2026-09-15'),
    (4, 'Prism', 'production', 'healthy', 'eu-west', 84, '2026-09-16'),
    (5, 'Fieldnotes', 'development', 'building', 'eu-west', 18, '2026-09-14'),
    (6, 'Canvas', 'staging', 'healthy', 'us-east', 64, '2026-09-15'),
    (7, 'Tempo', 'production', 'healthy', 'ap-south', 72, '2026-09-16'),
    (8, 'Meridian', 'staging', 'review', 'eu-west', 36, '2026-09-15'),
]
database.executemany('INSERT INTO projects VALUES (?, ?, ?, ?, ?, ?, ?)', rows)
database.commit()
database.close()
connection = dict(
    id='showcase-atelier', name='Atelier / demo', driver='sqlite',
    environment='development', read_only=False, host=str(root / 'atelier.db'),
    port=0, username='', database='atelier', ssl=False, ssh_tunnel=None,
    project_id='default',
)
(root / 'config' / 'connections.json').write_text(json.dumps([connection]))
# Match the actual EncryptedFileProvider format with a public, fixture-only key.
salt = os.urandom(16)
key = argon2id.kdf(32, b'showcase-local-fixture', salt, opslimit=3, memlimit=64 * 1024 * 1024)
nonce = os.urandom(24)
entry = 'qoredb_default\x1fcreds_showcase-atelier'
plaintext = json.dumps(dict(db_password='', ssh_password=None, ssh_key_passphrase=None, proxy_password=None)).encode()
ciphertext = crypto_aead_xchacha20poly1305_ietf_encrypt(plaintext, entry.encode(), nonce, key)
def b64(value):
    return base64.b64encode(value).decode()
(root / 'vault.enc').write_text(json.dumps(dict(version=1, salt=b64(salt), entries={entry: dict(nonce=b64(nonce), ct=b64(ciphertext))})))
os.chmod(root / 'vault.enc', 0o600)
print('Synthetic Atelier fixture ready in /tmp/qore-showcase-media')
