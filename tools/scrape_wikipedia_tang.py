#!/usr/bin/env python3
# NOTE: best-effort scraper; may fail if network blocks.
import json, re
from urllib.request import urlopen, Request

UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36'

def fetch(url: str) -> str:
    req = Request(url, headers={'User-Agent': UA})
    with urlopen(req, timeout=20) as f:
        return f.read().decode('utf-8', errors='ignore')

def strip_tags(s: str) -> str:
    s = re.sub(r'<sup[^>]*>.*?</sup>', '', s, flags=re.S)
    s = re.sub(r'<[^>]+>', '', s)
    s = re.sub(r'\s+', ' ', s)
    return s.strip()

def main():
    url = 'https://en.wikipedia.org/wiki/List_of_emperors_of_the_Tang_dynasty'
    html = fetch(url)
    tables = re.findall(r'<table class="wikitable[\s\S]*?</table>', html)
    if not tables:
        raise SystemExit('no wikitable found')
    table = tables[0]
    rows = re.findall(r'<tr[\s\S]*?</tr>', table)
    out = []
    for r in rows[1:]:
        cols = re.findall(r'<t[dh][\s\S]*?</t[dh]>', r)
        if len(cols) < 6:
            continue
        cols = [strip_tags(c) for c in cols]
        name = cols[1]
        reign = cols[3]
        m = re.search(r'(\d{3,4})\D+(\d{3,4})', reign)
        if not m:
            continue
        start, end = int(m.group(1)), int(m.group(2))
        out.append({'name': name, 'start': start, 'end': end})
    print(json.dumps({'source': url, 'rulers': out}, ensure_ascii=False, indent=2))

if __name__ == '__main__':
    main()
