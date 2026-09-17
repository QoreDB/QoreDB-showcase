"""Create synthetic SQLite data and an isolated QoreDB encrypted vault for capture.
Requires Python 3 + PyNaCl. This fixture never reads an existing QoreDB profile.
Every company, person and figure is generated from a fixed seed: nothing is real.
"""
import base64
import json
import os
from datetime import datetime, timedelta
from pathlib import Path
import random
import shutil
import sqlite3
from nacl.pwhash import argon2id
from nacl.bindings import crypto_aead_xchacha20poly1305_ietf_encrypt

root = Path(os.environ.get('QORE_MEDIA_ROOT', '/tmp/qore-showcase-media'))
(root / 'config').mkdir(parents=True, exist_ok=True)
(root / 'data').mkdir(exist_ok=True)
rng = random.Random(139)
now = datetime(2026, 9, 17, 9, 30)

path = root / 'atelier.db'
if path.exists():
    path.unlink()
database = sqlite3.connect(path)
database.executescript('''
PRAGMA foreign_keys = ON;
CREATE TABLE customers (
  id INTEGER PRIMARY KEY, company TEXT NOT NULL, contact TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE, country TEXT NOT NULL, plan TEXT NOT NULL,
  seats INTEGER NOT NULL, created_at TEXT NOT NULL
);
CREATE TABLE products (
  id INTEGER PRIMARY KEY, sku TEXT NOT NULL UNIQUE, name TEXT NOT NULL,
  category TEXT NOT NULL, price_cents INTEGER NOT NULL, active INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE orders (
  id INTEGER PRIMARY KEY, customer_id INTEGER NOT NULL REFERENCES customers(id),
  status TEXT NOT NULL, currency TEXT NOT NULL, total_cents INTEGER NOT NULL,
  placed_at TEXT NOT NULL
);
CREATE TABLE order_items (
  id INTEGER PRIMARY KEY, order_id INTEGER NOT NULL REFERENCES orders(id),
  product_id INTEGER NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL, unit_price_cents INTEGER NOT NULL
);
CREATE TABLE invoices (
  id INTEGER PRIMARY KEY, order_id INTEGER NOT NULL REFERENCES orders(id),
  number TEXT NOT NULL UNIQUE, status TEXT NOT NULL, due_at TEXT NOT NULL, paid_at TEXT
);
CREATE TABLE deployments (
  id INTEGER PRIMARY KEY, customer_id INTEGER NOT NULL REFERENCES customers(id),
  environment TEXT NOT NULL, region TEXT NOT NULL, version TEXT NOT NULL,
  status TEXT NOT NULL, duration_ms INTEGER NOT NULL, deployed_at TEXT NOT NULL
);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_placed_at ON orders(placed_at);
CREATE INDEX idx_items_order ON order_items(order_id);
CREATE INDEX idx_deployments_customer ON deployments(customer_id);
''')

prefixes = ['Nord', 'Alto', 'Brume', 'Cobalt', 'Delta', 'Ember', 'Fjord', 'Galen', 'Halo', 'Iris',
            'Juno', 'Kestrel', 'Lumen', 'Mistral', 'Nimbus', 'Opal', 'Pivot', 'Quartz', 'Rivage', 'Sable',
            'Tamis', 'Umbra', 'Verso', 'Willow', 'Yarrow', 'Zenith', 'Arbor', 'Basalt', 'Cirrus', 'Dune']
suffixes = ['Labs', 'Works', 'Studio', 'Systems', 'Logistics', 'Analytics', 'Robotics', 'Health',
            'Energy', 'Foods', 'Mobility', 'Finance', 'Cloud', 'Retail', 'Media', 'Atelier']
first = ['Camille', 'Noah', 'Inès', 'Lukas', 'Sofia', 'Mateo', 'Yuki', 'Amara', 'Elias', 'Nora', 'Theo',
         'Lina', 'Oskar', 'Maya', 'Hugo', 'Aiko', 'Jonas', 'Clara', 'Rafael', 'Anouk', 'Milan', 'Zoé']
last = ['Marchetti', 'Lindqvist', 'Okafor', 'Tanaka', 'Moreau', 'Becker', 'Santos', 'Novak', 'Haddad',
        'Keller', 'Ferrand', 'Ibarra', 'Jansen', 'Kowalski', 'Laurent', 'Nakamura', 'Olsen', 'Petit']
countries = [('FR', 22), ('DE', 16), ('US', 20), ('GB', 10), ('ES', 8), ('IT', 8), ('JP', 6), ('CA', 6), ('NL', 4)]
plans = [('starter', 45, (1, 8)), ('growth', 35, (6, 40)), ('scale', 15, (30, 160)), ('enterprise', 5, (120, 900))]
currency = {'FR': 'EUR', 'DE': 'EUR', 'ES': 'EUR', 'IT': 'EUR', 'NL': 'EUR', 'US': 'USD', 'CA': 'CAD', 'GB': 'GBP', 'JP': 'JPY'}


def weighted(options):
    return rng.choices(options, weights=[option[1] for option in options])[0]


def stamp(days_back, spread=1.0):
    moment = now - timedelta(days=days_back * spread, minutes=rng.randint(0, 1439))
    return moment.strftime('%Y-%m-%d %H:%M:%S')


def ascii_slug(value):
    return value.lower().translate(str.maketrans('èéëïîôö', 'eeeiioo'))


companies = rng.sample([f'{a} {b}' for a in prefixes for b in suffixes], 240)
customers = []
for index, company in enumerate(companies, start=1):
    person = (rng.choice(first), rng.choice(last))
    plan = weighted(plans)
    domain = company.lower().replace(' ', '') + '.example'
    customers.append((index, company, ' '.join(person), f'{ascii_slug(person[0])}.{ascii_slug(person[1])}@{domain}',
                      weighted(countries)[0], plan[0], rng.randint(*plan[2]), stamp(rng.randint(20, 900))))
database.executemany('INSERT INTO customers VALUES (?, ?, ?, ?, ?, ?, ?, ?)', customers)

catalog = [
    ('Platform', ['Core workspace', 'Team workspace', 'Audit trail', 'SSO connector', 'Usage insights'], (4900, 89000)),
    ('Compute', ['Worker S', 'Worker M', 'Worker L', 'Burst pool', 'GPU slice'], (1900, 149000)),
    ('Storage', ['Object vault 100G', 'Object vault 1T', 'Cold archive', 'Snapshot pack'], (900, 39000)),
    ('Support', ['Priority support', 'Onboarding session', 'Architecture review'], (9900, 240000)),
    ('Add-on', ['Extra seats x5', 'Custom domain', 'Data residency EU', 'Webhook relay', 'Log retention 90d'], (500, 19000)),
]
products = []
for category, names, (low, high) in catalog:
    for name in names:
        number = len(products) + 1
        price = round(rng.randint(low, high), -2) - 100 + 99
        products.append((number, f'{category[:3].upper()}-{number:03d}', name, category, price, int(rng.random() > 0.08)))
database.executemany('INSERT INTO products VALUES (?, ?, ?, ?, ?, ?)', products)

order_status = [('paid', 74), ('pending', 10), ('refunded', 5), ('failed', 6), ('draft', 5)]
orders, items, invoices = [], [], []
for order_id in range(1, 1801):
    customer = rng.choice(customers)
    weight = {'starter': 1, 'growth': 2, 'scale': 4, 'enterprise': 8}[customer[5]]
    status = weighted(order_status)[0]
    placed = stamp(rng.randint(0, 420))
    total = 0
    for _ in range(rng.randint(1, 2 + weight // 2)):
        product = rng.choice(products)
        quantity = rng.randint(1, 2 * weight)
        items.append((len(items) + 1, order_id, product[0], quantity, product[4]))
        total += quantity * product[4]
    orders.append((order_id, customer[0], status, currency[customer[4]], total, placed))
    if status in ('paid', 'pending', 'refunded'):
        due = datetime.strptime(placed, '%Y-%m-%d %H:%M:%S') + timedelta(days=30)
        paid = None if status == 'pending' else (due - timedelta(days=rng.randint(2, 29))).strftime('%Y-%m-%d')
        invoices.append((len(invoices) + 1, order_id, f'INV-2026-{len(invoices) + 1:05d}',
                         {'paid': 'settled', 'pending': 'open', 'refunded': 'void'}[status], due.strftime('%Y-%m-%d'), paid))
database.executemany('INSERT INTO orders VALUES (?, ?, ?, ?, ?, ?)', orders)
database.executemany('INSERT INTO order_items VALUES (?, ?, ?, ?, ?)', items)
database.executemany('INSERT INTO invoices VALUES (?, ?, ?, ?, ?, ?)', invoices)

regions = ['eu-west-3', 'eu-central-1', 'us-east-1', 'us-west-2', 'ap-northeast-1']
deploy_status = [('healthy', 80), ('degraded', 8), ('rolling', 7), ('failed', 5)]
deployments = []
for deployment_id in range(1, 961):
    customer = rng.choice(customers)
    deployments.append((deployment_id, customer[0], weighted([('production', 55), ('staging', 30), ('preview', 15)])[0],
                        rng.choice(regions), f'v{rng.randint(2, 4)}.{rng.randint(0, 18)}.{rng.randint(0, 9)}',
                        weighted(deploy_status)[0], rng.randint(8200, 214000), stamp(rng.randint(0, 120))))
database.executemany('INSERT INTO deployments VALUES (?, ?, ?, ?, ?, ?, ?, ?)', deployments)
database.commit()
counts = {table: database.execute(f'SELECT COUNT(*) FROM {table}').fetchone()[0]
          for table in ('customers', 'products', 'orders', 'order_items', 'invoices', 'deployments')}
database.close()

# The "production" connection is only a label on a second copy of the same synthetic file:
# it exists to show the real production safeguards, and nothing is ever executed against it.
production_path = root / 'atelier-production.db'
shutil.copyfile(path, production_path)


def connection(identifier, name, environment, file):
    return dict(
        id=identifier, name=name, driver='sqlite', environment=environment, read_only=False,
        host=str(file), port=0, username='', database='atelier', ssl=False, ssh_tunnel=None,
        project_id='default',
    )


connections = [
    connection('showcase-atelier', 'Atelier / demo', 'development', path),
    connection('showcase-atelier-production', 'Atelier / production', 'production', production_path),
]
(root / 'config' / 'connections.json').write_text(json.dumps(connections))
# Match the actual EncryptedFileProvider format with a public, fixture-only key.
salt = os.urandom(16)
key = argon2id.kdf(32, b'showcase-local-fixture', salt, opslimit=3, memlimit=64 * 1024 * 1024)
plaintext = json.dumps(dict(db_password='', ssh_password=None, ssh_key_passphrase=None, proxy_password=None)).encode()


def b64(value):
    return base64.b64encode(value).decode()


entries = {}
for item in connections:
    entry = f"qoredb_default\x1fcreds_{item['id']}"
    nonce = os.urandom(24)
    ciphertext = crypto_aead_xchacha20poly1305_ietf_encrypt(plaintext, entry.encode(), nonce, key)
    entries[entry] = dict(nonce=b64(nonce), ct=b64(ciphertext))
(root / 'vault.enc').write_text(json.dumps(dict(version=1, salt=b64(salt), entries=entries)))
os.chmod(root / 'vault.enc', 0o600)
print(f'Synthetic Atelier fixture ready in {root}: {counts}')
