import re, json

with open('src/lib/history/data/worldRulers.ts') as f:
    content = f.read()

keys = set()
for m in re.findall(r'(?:nameKey|bioKey|highlightKey):\s*["\']([^"\']+)["\']', content):
    keys.add(m)

for lang in ['en', 'ja', 'zh']:
    with open(f'src/messages/{lang}.json', 'r') as f:
        data = json.load(f)
    
    def flatten(d, prefix=''):
        result = set()
        for k, v in d.items():
            full = f'{prefix}.{k}' if prefix else k
            if isinstance(v, dict):
                result |= flatten(v, full)
            else:
                result.add(full)
        return result
    
    i18n_keys = flatten(data)
    missing = keys - i18n_keys
    if missing:
        print(f'{lang} MISSING ({len(missing)}): {sorted(missing)}')
    else:
        print(f'{lang}: all keys present')
