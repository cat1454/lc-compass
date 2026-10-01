"""Read public sources only; keep timestamped responses and hashes for review."""
import concurrent.futures
import hashlib
import json
from pathlib import Path
from datetime import datetime, timezone
from urllib.request import Request, urlopen
from urllib.parse import quote
from html.parser import HTMLParser

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'research' / 'antigravity-audit'
OUT.mkdir(exist_ok=True)

class Text(HTMLParser):
    def __init__(self):
        super().__init__(); self.parts = []; self.skip = 0
    def handle_starttag(self, tag, attrs):
        if tag in ('script', 'style'): self.skip += 1
        if tag == 'a':
            href = dict(attrs).get('href', '')
            if href: self.parts.append(' LINK: ' + href + ' ')
    def handle_endtag(self, tag):
        if tag in ('script', 'style'): self.skip = max(0, self.skip - 1)
    def handle_data(self, data):
        if not self.skip and data.strip(): self.parts.append(data.strip())

urls = {
    'ward-calendar': 'https://lienchieu.danang.gov.vn/web/guest/lich-cong-tac-ubnd',
    'startup-notice': 'https://lienchieu.danang.gov.vn/chi-tiet-tin-tuc?d=1045&c=7',
    'ward-home': 'https://lienchieu.danang.gov.vn/',
    'ward-map': 'https://lienchieu.danang.gov.vn/documents/20121/42772/bandolienchieu.jpg',
    'youth-union': 'https://thanhdoandanang.org.vn/',
}
queries = {
    'google-digital': 'site:lienchieu.danang.gov.vn "ngày hội" "chuyển đổi số" "2026"',
    'google-camp': '"Liên Chiểu" "hội trại" "2026"',
    'google-startup': '"Liên Chiểu" "tập huấn" "khởi nghiệp" "2026"',
    'google-security': '"Liên Chiểu" "dân phòng" "03/10/2026"',
    'google-boundary': '"phường Liên Chiểu" "ranh giới" GeoJSON',
}
urls.update({key: 'https://www.google.com/search?q=' + quote(q) for key, q in queries.items()})

def fetch(item):
    key, url = item
    result = {'id': key, 'url': url, 'checkedAt': datetime.now(timezone.utc).isoformat()}
    try:
        with urlopen(Request(url, headers={'User-Agent': 'Mozilla/5.0'}), timeout=25) as response:
            body = response.read(8_000_000)
            result.update(status=response.status, finalUrl=response.url, contentType=response.headers.get('Content-Type', ''), sha256=hashlib.sha256(body).hexdigest())
        if 'image' in result['contentType']:
            filename = key + '.jpg'; (OUT / filename).write_bytes(body)
        else:
            html = body.decode('utf-8', errors='replace')
            parser = Text(); parser.feed(html)
            filename = key + '.txt'; (OUT / filename).write_text('\n'.join(parser.parts), encoding='utf-8')
            result['characters'] = sum(map(len, parser.parts))
        result['artifact'] = filename
    except Exception as error:
        result.update(status='unavailable', error=str(error))
    return result

with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:
    results = list(pool.map(fetch, urls.items()))
(OUT / 'fetch-log.json').write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps([{k: row[k] for k in ('id', 'status', 'characters', 'error') if k in row} for row in results], ensure_ascii=False))
