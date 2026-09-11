from pathlib import Path
import json
import re
from bs4 import BeautifulSoup

path = Path('analytics/v2/index.html')
text = path.read_text()


def section_span(marker: str):
    marker_index = text.index(marker)
    start = text.rfind('<section', 0, marker_index)
    if start < 0:
        raise SystemExit(f'Could not find section start for {marker}')
    end_tag = '</section>'
    end = text.index(end_tag, marker_index) + len(end_tag)
    return start, end

project_start, project_end = section_span('id="active-links-carousel"')
track_start, track_end = section_span('id="top-discovery-tracks"')
project_html = text[project_start:project_end]
track_html = text[track_start:track_end]

project_soup = BeautifulSoup(project_html, 'html.parser')
track_soup = BeautifulSoup(track_html, 'html.parser')

projects = []
for card in project_soup.select('.activity-card'):
    name = card.select_one('p.truncate')
    thumb = card.select_one('img, svg')
    metric_nodes = card.select('.rounded-xl.bg-white p')
    values = []
    for node in metric_nodes[:3]:
        digits = re.sub(r'[^0-9]', '', node.get_text(' ', strip=True))
        values.append(int(digits or 0))
    while len(values) < 3:
        values.append(0)
    if not name:
        continue
    classes = thumb.get('class', []) if thumb else []
    projects.append({
        'name': name.get_text(' ', strip=True),
        'thumbHtml': str(thumb) if thumb else '',
        'isArtistPage': 'rounded-full' in classes or 'rounded-360' in classes,
        'metrics': [
            {'label': 'openings', 'value': values[0]},
            {'label': 'streams', 'value': values[1]},
            {'label': 'downloads', 'value': values[2]},
        ],
    })

tracks = []
for index, row in enumerate(track_soup.select('.analytics-track-row')):
    name_node = row.select_one('[data-testid="list-track-name"]')
    artist_node = row.select_one('[data-testid="list-artist-name"]')
    if not name_node:
        continue
    track_cell = name_node.find_parent(attrs={'data-testid': 'list-cell'})
    thumb = track_cell.select_one('img, svg') if track_cell else None
    tracks.append({
        'name': name_node.get_text(' ', strip=True),
        'artist': artist_node.get_text(' ', strip=True) if artist_node else '',
        'thumbHtml': str(thumb) if thumb else '',
        'originalIndex': index,
        'allDisplay': int(row.get('data-display') or 0),
    })

if not projects or not tracks:
    raise SystemExit('Failed to extract project or track data')

# Remove legacy presentation sections from the HTML, back to front to preserve offsets.
for start, end in sorted([(project_start, project_end), (track_start, track_end)], reverse=True):
    text = text[:start] + text[end:]

projects_json = json.dumps(projects, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
tracks_json = json.dumps(tracks, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')

# Remove legacy DOM references from the canonical app bootstrap.
text = text.replace('''        const legacyProjects = grid?.nextElementSibling;\n        const legacyTracks = document.getElementById("top-discovery-tracks");\n        if (!grid || !workspace || !hubsColumn || !legacyProjects || !legacyTracks) return;''', '''        if (!grid || !workspace || !hubsColumn) return;''', 1)

project_pattern = re.compile(r'''        const projects = \[\.\.\.legacyProjects\.querySelectorAll\("\.activity-card"\)\].*?          \.filter\(\(item\) => item\.name\);\n\n        const distribute''', re.S)
project_replacement = f'''        const elementFromHTML = (html) => {{\n          if (!html) return null;\n          const template = document.createElement("template");\n          template.innerHTML = html.trim();\n          const element = template.content.firstElementChild;\n          if (element) {{\n            element.removeAttribute("class");\n            element.removeAttribute("width");\n            element.removeAttribute("height");\n            element.setAttribute("aria-hidden", "true");\n            if (element.tagName === "IMG") element.alt = "";\n          }}\n          return element;\n        }};\n\n        const projects = {projects_json}.map((item) => ({{\n          ...item,\n          thumb: elementFromHTML(item.thumbHtml),\n        }}));\n\n        const distribute'''
text, count = project_pattern.subn(lambda _: project_replacement, text, count=1)
if count != 1:
    raise SystemExit(f'Project model replacement failed: {count}')

track_pattern = re.compile(r'''        const tracks = \[\.\.\.legacyTracks\.querySelectorAll\("\.analytics-track-row"\)\].*?          \.filter\(\(item\) => item\.name\);''', re.S)
track_replacement = f'''        const tracks = {tracks_json}.map((item, index) => {{\n          const assignedHubs = hubPatterns[index % hubPatterns.length];\n          const split = distribute(item.allDisplay, assignedHubs, index);\n          const hubMetrics = {{ all: item.allDisplay }};\n          assignedHubs.forEach((hub) => {{ hubMetrics[hub] = split[hub]; }});\n          return {{\n            ...item,\n            thumb: elementFromHTML(item.thumbHtml),\n            hubMetrics,\n          }};\n        }});'''
text, count = track_pattern.subn(lambda _: track_replacement, text, count=1)
if count != 1:
    raise SystemExit(f'Track model replacement failed: {count}')

text = text.replace('''        // The legacy sections are now only migration inputs. Remove them immediately after building the model.\n        legacyProjects.remove();\n        legacyTracks.remove();\n\n''', '', 1)

# Keep period semantics explicit in accessibility labels.
text = text.replace(
'''          all: { factor: 1, axis: ["May 2022", "Jan 2025", "Today"] },\n          week: { factor: 0.035, axis: ["21 Aug", "24 Aug", "Today"] },\n          month: { factor: 0.13, axis: ["28 Jul", "12 Aug", "Today"] },\n          year: { factor: 0.62, axis: ["Aug 2025", "Feb 2026", "Today"] },''',
'''          all: { label: "All Time", factor: 1, axis: ["May 2022", "Jan 2025", "Today"] },\n          week: { label: "Last Week", factor: 0.035, axis: ["21 Aug", "24 Aug", "Today"] },\n          month: { label: "Last Month", factor: 0.13, axis: ["28 Jul", "12 Aug", "Today"] },\n          year: { label: "Last Year", factor: 0.62, axis: ["Aug 2025", "Feb 2026", "Today"] },''',
1,
)
text = text.replace(
'''          hubChart?.setAttribute("aria-label", `Displays on ${hubNames[currentHub]}`);''',
'''          hubChart?.setAttribute("aria-label", `Displays on ${hubNames[currentHub]} for ${periods[currentPeriod].label}`);''',
1,
)

# Restore keyboard focus containment for the mobile navigation.
needle = '''        document.addEventListener("keydown", (event) => {\n          if (event.key === "Escape" && primaryNavigation?.classList.contains("mobile-nav-open")) setMobileNavigation(false);\n        });'''
replacement = '''        document.addEventListener("keydown", (event) => {\n          const navigationOpen = primaryNavigation?.classList.contains("mobile-nav-open");\n          if (event.key === "Escape" && navigationOpen) {\n            setMobileNavigation(false);\n            return;\n          }\n          if (event.key === "Tab" && navigationOpen && primaryNavigation) {\n            const focusable = [...primaryNavigation.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')]\n              .filter((element) => element.getClientRects().length > 0);\n            const first = focusable[0];\n            const last = focusable[focusable.length - 1];\n            if (!first || !last) return;\n            if (event.shiftKey && document.activeElement === first) {\n              event.preventDefault();\n              last.focus();\n            } else if (!event.shiftKey && document.activeElement === last) {\n              event.preventDefault();\n              first.focus();\n            }\n          }\n        });'''
if needle not in text:
    raise SystemExit('Navigation keydown block not found')
text = text.replace(needle, replacement, 1)

# Validation: the retired presentations and migration references are gone from source.
for obsolete in [
    'id="top-discovery-tracks"',
    'id="active-links-carousel"',
    'legacyProjects',
    'legacyTracks',
    'analytics-v2-overview-layout',
    'analytics-v2-compact-tracklist',
    'analytics-v2-polish-pass',
    'analytics-v2-mobile-tracklist-principles',
    'analytics-v2-row-harmonization',
    'analytics-v2-project-list-polish',
]:
    if obsolete in text:
        raise SystemExit(f'Obsolete source remains: {obsolete}')
if text.count('id="analytics-v2-overview-clean"') != 1 or text.count('id="analytics-v2-app"') != 1:
    raise SystemExit('Canonical analytics blocks are not unique')

path.write_text(text)
