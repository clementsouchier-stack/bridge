from pathlib import Path
import base64
import gzip
import re
from bs4 import BeautifulSoup

target = Path('analytics/v2/index.html')
text = target.read_text()
b64 = ''.join(Path(f'.github/tmp_share_ref/raw0{i}.txt').read_text().strip() for i in range(3))
fragment = gzip.decompress(base64.b64decode(b64)).decode('utf-8')
soup = BeautifulSoup(fragment, 'html.parser')
root = soup.select_one('#__next')
children = [c for c in root.children if getattr(c, 'name', None)]
if len(children) != 4:
    raise SystemExit(f'Unexpected source root shape: {len(children)}')

app_shell, share_panel, activity_wrap, notifications = children
activity_wrap['data-proto-activity-panel'] = 'true'
activity_inner = next(c for c in activity_wrap.children if getattr(c, 'name', None))
activity_inner['data-proto-activity-inner'] = 'true'
close_btn = activity_wrap.find('button')
if not close_btn:
    raise SystemExit('Activity close button not found')
close_btn['data-proto-activity-close'] = 'true'
close_btn['aria-label'] = 'Close activity report'

for a in root.find_all('a'):
    if a.get_text(' ', strip=True) == 'Analytics':
        a['data-proto-return-analytics'] = 'true'
    a['href'] = '#'

cover = 'https://images.bridge.audio/ybPKHYCeVn2XtkAmKeH0_59S4B6FGo8dvLCWzNtKdww/fill/1200/500/ce/0/czM6Ly9iZGdhLXByZC1wdWIvcHJvamVjdC9jb3ZlcnMvMzIvNjAvYjcvM2IvOWYyNTViM2EtMGUxNy00NmMzLWIyMTYtYTM3NTNiYjc2MDMyLmpwZw.jpg'
avatar_match = re.search(r'<img[^>]+data-testid="avatar-image"[^>]+src="([^"]+)"', text)
avatar = avatar_match.group(1) if avatar_match else cover
local_map = {
    '6b6e073a-d597-4617-abae-a45675f61ad0.jpg': avatar,
    '266b2f39-7c85-455b-adc2-a1fe9a0c8382.jpg': avatar,
    '9f255b3a-0e17-46c3-b216-a3753bb76032.jpg': cover,
    'be91684e-ed2c-4e79-bf08-11ddeee9fb55.jpg': cover,
    '0e90727d-0ea8-4273-b014-5df7c0ecb606.jpg': cover,
    '3a370aa9-c900-444e-b2de-c75b3a269282.jpg': cover,
    'video.svg': 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"%3E%3Crect width="40" height="40" rx="4" fill="%23E9EBEE"/%3E%3Cpath d="M16 13.5v13l11-6.5-11-6.5Z" fill="%23071331"/%3E%3C/svg%3E',
}
for img in root.find_all('img'):
    src = img.get('src', '')
    if 'Presskit Bertrand Burgalat_files/' in src:
        name = src.rsplit('/', 1)[-1]
        img['src'] = local_map.get(name, cover)

template_html = '<template id="project-reference-template">' + str(root) + '</template>'

start = text.find('      .analytics-overview-row.is-share-link {')
if start != -1:
    end = text.find('\n\n    </style>', start)
    if end == -1:
        raise SystemExit('Could not delimit old share detail CSS')
    text = text[:start] + text[end:]

exact_css = '''
      .analytics-overview-row.is-share-link {
        width: 100%;
        border: 0;
        background: transparent;
        color: inherit;
        font: inherit;
        text-align: left;
        cursor: pointer;
      }
      .analytics-overview-row.is-share-link:hover,
      .analytics-overview-row.is-share-link:focus-visible {
        background: var(--primary3XlSoftBg, #f5f6f7);
      }
      .analytics-overview-row.is-share-link:focus-visible {
        outline: 2px solid var(--accentBorder, #1260eb);
        outline-offset: -2px;
      }
      .project-reference-overlay {
        position: fixed;
        inset: 0;
        z-index: 200;
        overflow: hidden;
        background: var(--primarySurface, #f0f2f4);
      }
      .project-reference-overlay > #__next,
      .project-reference-overlay > #__next > div:first-child {
        width: 100%;
        height: 100%;
      }
      .project-reference-overlay [data-proto-activity-inner] {
        right: 0 !important;
      }
      .project-reference-overlay.activity-closed [data-proto-activity-inner] {
        right: -500px !important;
      }
      @media (max-width: 767px) {
        .project-reference-overlay.activity-closed [data-proto-activity-inner] {
          right: -100vw !important;
        }
      }
'''
style_close = text.find('\n\n    </style>')
if style_close == -1:
    raise SystemExit('Style closing marker not found')
text = text[:style_close] + '\n' + exact_css + text[style_close:]

text = re.sub(r'\s*<template id="project-reference-template">.*?</template>\s*', '\n', text, flags=re.S)
script_marker = '    <script id="analytics-v2-app">'
if script_marker not in text:
    raise SystemExit('Analytics app script marker missing')
text = text.replace(script_marker, '    ' + template_html + '\n\n' + script_marker, 1)

new_helpers = '''
        let activeShareTrigger = null;
        const closeShareDetail = () => {
          const overlay = document.querySelector('.project-reference-overlay');
          if (!overlay) return;
          overlay.remove();
          document.body.style.overflow = '';
          history.replaceState({}, '', location.pathname + location.search);
          activeShareTrigger?.focus();
          activeShareTrigger = null;
        };

        const openShareDetail = (item, trigger) => {
          closeShareDetail();
          activeShareTrigger = trigger || null;
          const template = document.getElementById('project-reference-template');
          if (!template) return;
          const overlay = document.createElement('div');
          overlay.className = 'project-reference-overlay';
          overlay.appendChild(template.content.cloneNode(true));
          document.body.appendChild(overlay);
          document.body.style.overflow = 'hidden';

          const closeActivity = overlay.querySelector('[data-proto-activity-close]');
          closeActivity?.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            overlay.classList.add('activity-closed');
          });

          overlay.querySelectorAll('[data-proto-return-analytics]').forEach((link) => {
            link.addEventListener('click', (event) => {
              event.preventDefault();
              closeShareDetail();
            });
          });
          overlay.addEventListener('click', (event) => {
            const anchor = event.target.closest('a[href="#"]');
            if (anchor) event.preventDefault();
          });
          overlay.addEventListener('keydown', (event) => {
            if (event.key !== 'Escape') return;
            if (!overlay.classList.contains('activity-closed')) overlay.classList.add('activity-closed');
            else closeShareDetail();
          });
          history.replaceState({ share: 'Presskit Bertrand Burgalat' }, '', '#share=Presskit%20Bertrand%20Burgalat');
          closeActivity?.focus();
        };

'''
helper_start = text.find('        const displayShareName =')
panel_start = text.find('        const projectPanel = createPanel({')
if helper_start == -1 or panel_start == -1 or panel_start <= helper_start:
    raise SystemExit('Could not locate old share detail helper block')
text = text[:helper_start] + new_helpers + text[panel_start:]

text = text.replace('title: "Most active projects"', 'title: "Most popular shares"')
text = text.replace('description: "Projects generating the most activity in your workspace."', 'description: "Shared projects, artist pages and albums generating the most activity."')

for needle, label in [
    ('Most popular shares', 'popular shares title'),
    ('project-reference-template', 'exact template'),
    ('data-proto-activity-close', 'activity close hook'),
    ('activity-closed', 'activity close state'),
    ('Presskit Bertrand Burgalat', 'reference project content'),
    ('5 tracks', 'reference project metadata'),
]:
    if needle not in text:
        raise SystemExit(f'Missing validation: {label}')
if 'share-detail-shell' in text:
    raise SystemExit('Old hand-built share detail still present')

target.write_text(text)
