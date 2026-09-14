from pathlib import Path
import re

path = Path('analytics/v2/index.html')
text = path.read_text()

if 'share-detail-shell' in text:
    raise SystemExit('share detail already present')

# Rename section.
text = text.replace('title: "Most active projects",', 'title: "Most popular shares",', 1)
text = text.replace('description: "Projects generating the most activity in your workspace.",', 'description: "Shared projects, artist pages and albums generating the most activity.",', 1)

css = r'''

      /* Share detail / Activity panel */
      .analytics-overview-row.is-share-link {
        width: 100%;
        appearance: none;
        color: inherit;
        font: inherit;
        text-align: left;
        cursor: pointer;
      }
      .analytics-overview-row.is-share-link:focus-visible {
        outline: 2px solid var(--accentBorder, #1260eb);
        outline-offset: 2px;
      }
      .share-detail-shell {
        position: fixed;
        inset: 0;
        z-index: 80;
        display: grid;
        grid-template-columns: minmax(0, 1fr) 498px;
        background: var(--primarySurface, #f0f2f4);
      }
      .share-detail-main {
        min-width: 0;
        overflow: auto;
        padding: 12px;
      }
      .share-detail-page {
        min-height: 100%;
        overflow: hidden;
        border-radius: 18px;
        background: var(--secondarySurface, #fff);
      }
      .share-detail-header {
        position: sticky;
        top: 0;
        z-index: 3;
        display: flex;
        min-height: 64px;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        border-bottom: 1px solid var(--secondaryBorder, #e5e5e5);
        background: var(--secondarySurface, #fff);
        padding: 0 20px;
      }
      .share-detail-breadcrumb {
        display: flex;
        min-width: 0;
        align-items: center;
        gap: 8px;
        color: var(--secondaryContent, #666);
        font-size: 12px;
      }
      .share-detail-breadcrumb strong {
        overflow: hidden;
        color: var(--primaryDarkContent, #071331);
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .share-detail-header-actions {
        display: flex;
        flex: 0 0 auto;
        gap: 8px;
      }
      .share-detail-action,
      .share-detail-back,
      .activity-panel-close {
        display: inline-flex;
        min-height: 36px;
        align-items: center;
        justify-content: center;
        gap: 6px;
        border-radius: 8px;
        padding: 0 12px;
        color: var(--primaryDarkContent, #071331);
        font-size: 12px;
        font-weight: 650;
      }
      .share-detail-action:hover,
      .share-detail-back:hover,
      .activity-panel-close:hover,
      .share-detail-action:focus-visible,
      .share-detail-back:focus-visible,
      .activity-panel-close:focus-visible {
        background: var(--neutralSoftBg, #f0f2f4);
        outline: none;
      }
      .share-detail-body {
        max-width: 980px;
        margin: 0 auto;
        padding: 36px 32px 64px;
      }
      .share-detail-hero {
        display: grid;
        grid-template-columns: 176px minmax(0, 1fr);
        align-items: center;
        gap: 28px;
        margin-bottom: 38px;
      }
      .share-detail-artwork {
        width: 176px;
        height: 176px;
        overflow: hidden;
        border-radius: 10px;
        background: var(--neutralSoftBg, #f0f2f4);
      }
      .share-detail-artwork.is-artist {
        border-radius: 999px;
      }
      .share-detail-artwork img,
      .share-detail-artwork svg {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .share-detail-eyebrow {
        margin-bottom: 8px;
        color: var(--secondaryContent, #666);
        font-size: 11px;
        font-weight: 650;
        letter-spacing: .04em;
        text-transform: uppercase;
      }
      .share-detail-title {
        color: var(--primaryDarkContent, #071331);
        font-size: clamp(24px, 3vw, 38px);
        font-weight: 700;
        line-height: 1.08;
      }
      .share-detail-subtitle {
        max-width: 56ch;
        margin-top: 12px;
        color: var(--secondaryContent, #666);
        font-size: 13px;
        line-height: 1.55;
      }
      .share-detail-stats {
        display: flex;
        flex-wrap: wrap;
        gap: 10px 22px;
        margin-top: 18px;
        color: var(--secondaryContent, #666);
        font-size: 11px;
      }
      .share-detail-stats strong {
        color: var(--primaryDarkContent, #071331);
        font-size: 13px;
      }
      .share-detail-section-title {
        margin-bottom: 14px;
        color: var(--primaryDarkContent, #071331);
        font-size: 14px;
        font-weight: 700;
      }
      .share-detail-media-list {
        overflow: hidden;
        border: 1px solid var(--secondaryBorder, #e5e5e5);
        border-radius: 12px;
      }
      .share-detail-media-row {
        display: grid;
        min-height: 58px;
        grid-template-columns: 36px minmax(0, 1fr) auto;
        align-items: center;
        gap: 12px;
        border-bottom: 1px solid var(--secondaryBorder, #e5e5e5);
        padding: 8px 14px;
      }
      .share-detail-media-row:last-child { border-bottom: 0; }
      .share-detail-media-index {
        color: var(--secondaryContent, #666);
        font-size: 11px;
        text-align: center;
      }
      .share-detail-media-name {
        overflow: hidden;
        color: var(--primaryDarkContent, #071331);
        font-size: 12px;
        font-weight: 650;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .share-detail-media-meta {
        color: var(--secondaryContent, #666);
        font-size: 10px;
      }
      .activity-panel {
        position: relative;
        z-index: 4;
        display: flex;
        min-width: 0;
        flex-direction: column;
        overflow: hidden;
        border-left: 1px solid var(--secondaryBorder, #e5e5e5);
        background: var(--secondarySurface, #fff);
        box-shadow: -8px 0 28px rgba(20, 20, 25, .06);
      }
      .activity-panel-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 22px 24px 10px;
      }
      .activity-panel-title {
        overflow: hidden;
        color: var(--primaryDarkContent, #071331);
        font-size: 14px;
        font-weight: 700;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .activity-panel-copy {
        padding: 0 24px 18px;
        color: var(--secondaryContent, #666);
        font-size: 11px;
      }
      .activity-panel-filters {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        padding: 0 24px 22px;
      }
      .activity-filter-chip {
        display: inline-flex;
        min-height: 32px;
        align-items: center;
        border-radius: 7px;
        background: var(--neutralSoftBg, #f0f2f4);
        padding: 0 13px;
        color: var(--primaryDarkContent, #071331);
        font-size: 11px;
        font-weight: 550;
      }
      .activity-panel-scroll {
        overflow: auto;
        padding: 0 24px 32px;
      }
      .activity-day {
        margin: 4px 0 12px;
        color: var(--accentContent, #1260eb);
        font-size: 11px;
        font-weight: 700;
      }
      .activity-timeline {
        border-left: 1px solid var(--secondaryBorder, #e5e5e5);
        padding-left: 10px;
      }
      .activity-row {
        display: grid;
        min-height: 48px;
        grid-template-columns: 38px 32px minmax(0, 1fr);
        align-items: center;
        gap: 9px;
      }
      .activity-time {
        color: var(--secondaryContent, #666);
        font-size: 10px;
      }
      .activity-icon {
        display: flex;
        width: 32px;
        height: 32px;
        align-items: center;
        justify-content: center;
        border-radius: 6px;
        background: var(--neutralSoftBg, #f0f2f4);
        color: var(--primaryDarkContent, #071331);
        font-size: 14px;
      }
      .activity-label {
        overflow: hidden;
        color: var(--primaryDarkContent, #071331);
        font-size: 11px;
        line-height: 1.35;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .activity-label strong { font-weight: 700; }
      .activity-link-name {
        margin-top: 1px;
        color: var(--secondaryContent, #666);
        font-size: 10px;
      }
      .share-detail-shell.activity-closed {
        grid-template-columns: minmax(0, 1fr) 0;
      }
      .share-detail-shell.activity-closed .activity-panel {
        visibility: hidden;
        width: 0;
        border: 0;
      }
      @media (max-width: 900px) {
        .share-detail-shell { grid-template-columns: minmax(0, 1fr) min(440px, 48vw); }
        .share-detail-body { padding-right: 24px; padding-left: 24px; }
        .share-detail-hero { grid-template-columns: 128px minmax(0, 1fr); gap: 20px; }
        .share-detail-artwork { width: 128px; height: 128px; }
      }
      @media (max-width: 640px) {
        .share-detail-shell { display: block; }
        .share-detail-main { height: 100dvh; padding: 0; }
        .share-detail-page { border-radius: 0; }
        .share-detail-header { padding: 0 14px; }
        .share-detail-body { padding: 24px 16px 48px; }
        .share-detail-hero { grid-template-columns: 88px minmax(0, 1fr); gap: 14px; margin-bottom: 28px; }
        .share-detail-artwork { width: 88px; height: 88px; }
        .share-detail-title { font-size: 22px; }
        .share-detail-subtitle { display: none; }
        .share-detail-stats { gap: 6px 12px; margin-top: 10px; font-size: 9px; }
        .share-detail-stats strong { font-size: 11px; }
        .activity-panel {
          position: fixed;
          inset: 0;
          z-index: 6;
          border-left: 0;
        }
        .share-detail-shell.activity-closed .activity-panel { display: none; }
      }
'''

style_pattern = re.compile(r'(<style id="analytics-v2-overview-clean">)(.*?)(</style>)', re.S)
m = style_pattern.search(text)
if not m:
    raise SystemExit('overview clean style not found')
text = text[:m.start()] + m.group(1) + m.group(2) + css + '\n    ' + m.group(3) + text[m.end():]

# Inject detail behavior before panel creation.
anchor = '        const projectPanel = createPanel({'
if anchor not in text:
    raise SystemExit('project panel anchor not found')

js = r'''
        const shareType = (item) => {
          if (item.kind) return item.kind;
          if (item.isArtistPage) return "Artist page";
          if (/album|ep|lp/i.test(item.name)) return "Album";
          return "Project";
        };

        const displayShareName = (item) =>
          item.name === "Presskit Bertrand BB" ? "Presskit Bertrand Burgalat" : item.name;

        const activityEventsFor = (item) => {
          const title = displayShareName(item);
          if (/Bertrand/i.test(title)) {
            return [
              ["22:10", "♫", "Streamed", "Parallèles", "Sophie"],
              ["22:06", "♫", "Streamed", "Spectacle du monde", "Sophie"],
              ["22:02", "♫", "Streamed", "Du haut du 33e étage", "Sophie"],
              ["21:59", "♫", "Streamed", "Flash", "Sophie"],
              ["18:41", "↓", "Downloaded", "Parallèles", "Music supervisor"],
              ["17:08", "↗", "Opened", title, "Lucie"],
            ];
          }
          const media = item.isArtistPage ? ["Latest release", "Artist page", "Featured track"] : ["Main share", "Track 01", "Track 02"];
          return [
            ["16:42", "↗", "Opened", title, "A&R contact"],
            ["16:31", "♫", "Streamed", media[1], "Guest listener"],
            ["15:58", "♫", "Streamed", media[2], "Guest listener"],
            ["14:12", "↓", "Downloaded", media[0], "Music supervisor"],
            ["11:47", "↗", "Opened", title, "Shared link"],
          ];
        };

        let activeShareTrigger = null;

        const closeShareDetail = () => {
          const detail = document.querySelector(".share-detail-shell");
          if (!detail) return;
          detail.remove();
          document.body.style.overflow = "";
          activeShareTrigger?.focus();
          activeShareTrigger = null;
          history.replaceState(null, "", location.pathname + location.search);
        };

        const openShareDetail = (item, trigger) => {
          closeShareDetail();
          activeShareTrigger = trigger;
          const title = displayShareName(item);
          const kind = shareType(item);
          const shell = document.createElement("div");
          shell.className = "share-detail-shell";
          shell.setAttribute("role", "dialog");
          shell.setAttribute("aria-modal", "true");
          shell.setAttribute("aria-label", `${title} activity`);

          const main = document.createElement("div");
          main.className = "share-detail-main";
          const page = document.createElement("div");
          page.className = "share-detail-page";

          const header = document.createElement("div");
          header.className = "share-detail-header";
          const breadcrumb = document.createElement("div");
          breadcrumb.className = "share-detail-breadcrumb";
          breadcrumb.innerHTML = `<span>${kind === "Artist page" ? "Artists" : kind === "Album" ? "Albums" : "Projects"}</span><span>/</span><strong>${title}</strong>`;
          const actions = document.createElement("div");
          actions.className = "share-detail-header-actions";
          const activityButton = document.createElement("button");
          activityButton.type = "button";
          activityButton.className = "share-detail-action";
          activityButton.textContent = "Activity";
          const back = document.createElement("button");
          back.type = "button";
          back.className = "share-detail-back";
          back.textContent = "Back to Analytics";
          actions.append(activityButton, back);
          header.append(breadcrumb, actions);

          const body = document.createElement("div");
          body.className = "share-detail-body";
          const hero = document.createElement("div");
          hero.className = "share-detail-hero";
          const artwork = document.createElement("div");
          artwork.className = `share-detail-artwork${item.isArtistPage ? " is-artist" : ""}`;
          if (item.thumb) artwork.appendChild(item.thumb.cloneNode(true));
          const heroCopy = document.createElement("div");
          const eyebrow = document.createElement("div");
          eyebrow.className = "share-detail-eyebrow";
          eyebrow.textContent = kind;
          const h1 = document.createElement("h1");
          h1.className = "share-detail-title";
          h1.textContent = title;
          const subtitle = document.createElement("p");
          subtitle.className = "share-detail-subtitle";
          subtitle.textContent = item.isArtistPage
            ? "Artist page shared from your Bridge workspace, with media and activity gathered in one place."
            : "Shared content from your Bridge workspace. Activity reflects opens, streams and downloads generated by your links.";
          const stats = document.createElement("div");
          stats.className = "share-detail-stats";
          item.metrics.forEach((metric) => {
            const span = document.createElement("span");
            span.innerHTML = `<strong>${numberFormat.format(scaled(metric.value))}</strong> ${metric.label}`;
            stats.appendChild(span);
          });
          heroCopy.append(eyebrow, h1, subtitle, stats);
          hero.append(artwork, heroCopy);

          const sectionTitle = document.createElement("div");
          sectionTitle.className = "share-detail-section-title";
          sectionTitle.textContent = item.isArtistPage ? "Featured media" : "Content";
          const mediaList = document.createElement("div");
          mediaList.className = "share-detail-media-list";
          const mediaNames = /Bertrand/i.test(title)
            ? ["Parallèles", "Spectacle du monde", "Du haut du 33e étage", "Flash", "Les choses qu'on ne peut dire à personne"]
            : item.isArtistPage
              ? ["Latest release", "Featured track", "Press photos", "Biography"]
              : ["Main presentation", "Track 01", "Track 02", "Artwork & assets"];
          mediaNames.forEach((mediaName, index) => {
            const mediaRow = document.createElement("div");
            mediaRow.className = "share-detail-media-row";
            mediaRow.innerHTML = `<div class="share-detail-media-index">${String(index + 1).padStart(2, "0")}</div><div><div class="share-detail-media-name">${mediaName}</div><div class="share-detail-media-meta">${index < 3 ? "Audio" : "Media"}</div></div><div class="share-detail-media-meta">${index < 3 ? "03:" + String(12 + index * 7).padStart(2, "0") : ""}</div>`;
            mediaList.appendChild(mediaRow);
          });
          body.append(hero, sectionTitle, mediaList);
          page.append(header, body);
          main.appendChild(page);

          const panel = document.createElement("aside");
          panel.className = "activity-panel";
          panel.setAttribute("aria-label", `Activity report for ${title}`);
          const panelHeader = document.createElement("div");
          panelHeader.className = "activity-panel-header";
          const panelTitle = document.createElement("div");
          panelTitle.className = "activity-panel-title";
          panelTitle.textContent = "Activity report";
          panelTitle.title = `Activity report ${title}`;
          const close = document.createElement("button");
          close.type = "button";
          close.className = "activity-panel-close";
          close.setAttribute("aria-label", "Close activity panel");
          close.textContent = "×";
          panelHeader.append(panelTitle, close);
          const panelCopy = document.createElement("div");
          panelCopy.className = "activity-panel-copy";
          panelCopy.textContent = "All activities recorded on the links you shared";
          const filters = document.createElement("div");
          filters.className = "activity-panel-filters";
          ["Type", "Date", "Link"].forEach((label) => {
            const chip = document.createElement("button");
            chip.type = "button";
            chip.className = "activity-filter-chip";
            chip.textContent = label;
            filters.appendChild(chip);
          });
          const scroll = document.createElement("div");
          scroll.className = "activity-panel-scroll";
          const day = document.createElement("div");
          day.className = "activity-day";
          day.textContent = "Friday, 11 September 2026";
          const timeline = document.createElement("div");
          timeline.className = "activity-timeline";
          activityEventsFor(item).forEach(([time, icon, action, media, link]) => {
            const row = document.createElement("div");
            row.className = "activity-row";
            row.innerHTML = `<div class="activity-time">${time}</div><div class="activity-icon">${icon}</div><div><div class="activity-label">${action} <strong>“${media}”</strong></div><div class="activity-link-name">${link}</div></div>`;
            timeline.appendChild(row);
          });
          scroll.append(day, timeline);
          panel.append(panelHeader, panelCopy, filters, scroll);
          shell.append(main, panel);
          document.body.appendChild(shell);
          document.body.style.overflow = "hidden";

          const closeActivity = () => shell.classList.add("activity-closed");
          close.addEventListener("click", closeActivity);
          activityButton.addEventListener("click", () => shell.classList.remove("activity-closed"));
          back.addEventListener("click", closeShareDetail);
          shell.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
              if (!shell.classList.contains("activity-closed")) closeActivity();
              else closeShareDetail();
            }
          });
          history.replaceState({ share: title }, "", `#share=${encodeURIComponent(title)}`);
          back.focus();
        };

'''
text = text.replace(anchor, js + anchor, 1)

# Make share rows interactive buttons and wire open state.
old = '''          projects.slice(0, visibleState.projects).forEach((item) => {\n            const row = document.createElement("div");\n            row.className = "analytics-overview-row";'''
new = '''          projects.slice(0, visibleState.projects).forEach((item) => {\n            const row = document.createElement("button");\n            row.type = "button";\n            row.className = "analytics-overview-row is-share-link";\n            row.setAttribute("aria-label", `Open ${displayShareName(item)} and its activity`);'''
if old not in text:
    raise SystemExit('project row block not found')
text = text.replace(old, new, 1)

old_append = '''            row.appendChild(main);\n            projectPanel.list.appendChild(row);'''
new_append = '''            row.appendChild(main);\n            row.addEventListener("click", () => openShareDetail(item, row));\n            projectPanel.list.appendChild(row);'''
if old_append not in text:
    raise SystemExit('project row append block not found')
text = text.replace(old_append, new_append, 1)

# Validation.
checks = [
    'title: "Most popular shares"',
    'className = "analytics-overview-row is-share-link"',
    'className = "share-detail-shell"',
    'Activity report',
    'Back to Analytics',
]
for check in checks:
    if check not in text:
        raise SystemExit(f'missing validation token: {check}')
if text.count('share-detail-shell') < 2:
    raise SystemExit('share detail CSS/JS validation failed')

path.write_text(text)
