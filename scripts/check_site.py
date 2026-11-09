#!/usr/bin/env python3
"""Check local HTML structure, asset paths, and cross-page anchor links."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
VOID = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'}

class Page(HTMLParser):
    def __init__(self, path):
        super().__init__(convert_charrefs=True)
        self.path, self.ids, self.links, self.stack, self.errors = path, set(), [], [], []
        self.h1_count = 0
        self.feed(path.read_text())
        if self.stack:
            self.errors.append(f'Unclosed tags: {self.stack}')
        if self.h1_count != 1:
            self.errors.append(f'Expected one h1, found {self.h1_count}')

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'h1':
            self.h1_count += 1
        if 'id' in attrs:
            if attrs['id'] in self.ids:
                self.errors.append(f'Duplicate ID: {attrs["id"]}')
            self.ids.add(attrs['id'])
        for key in ('href', 'src'):
            if key in attrs:
                self.links.append(attrs[key])
        if tag not in VOID:
            self.stack.append(tag)

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in VOID:
            self.handle_endtag(tag)

    def handle_endtag(self, tag):
        if tag in VOID:
            return
        if not self.stack or self.stack[-1] != tag:
            self.errors.append(f'Unexpected closing tag: {tag}')
        else:
            self.stack.pop()

pages = {path.resolve(): Page(path) for path in ROOT.rglob('*.html')}
checked = 0
for path, page in pages.items():
    for href in page.links:
        url = urlsplit(href)
        if url.scheme or url.netloc:
            continue
        checked += 1
        if url.path.startswith('/'):
            page.errors.append(f'Root-relative path breaks repository subpath hosting: {href}')
        target = (path.parent / unquote(url.path)).resolve() if url.path else path
        if target.is_dir():
            target /= 'index.html'
        if not target.exists():
            page.errors.append(f'Missing local target: {href}')
        elif url.fragment and target in pages and unquote(url.fragment) not in pages[target].ids:
            page.errors.append(f'Missing anchor: {href}')
    for error in page.errors:
        print(f'{path.relative_to(ROOT)}: {error}')
errors = sum(len(page.errors) for page in pages.values())
if errors:
    raise SystemExit(f'Failed with {errors} error(s).')
print(f'Passed: {len(pages)} HTML pages; {checked} local links/assets; balanced markup; unique IDs.')
