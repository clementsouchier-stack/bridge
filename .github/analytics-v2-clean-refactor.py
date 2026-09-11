from pathlib import Path
import re

path = Path('analytics/v2/index.html')
text = path.read_text()

# Remove the first-generation overview CSS appended inside the source style.
text = re.sub(
    r'\n\s*/\* analytics-v2-overview-layout \*/.*?(?=\n\s*</style>\n\s*<style id="analytics-v2-optimized")',
    '',
    text,
    count=1,
    flags=re.S,
)

# Remove every iterative overview style layer. They are replaced by one canonical block below.
for style_id in [
    'analytics-v2-compact-tracklist',
    'analytics-v2-polish-pass',
    'analytics-v2-mobile-tracklist-principles',
    'analytics-v2-row-harmonization',
    'analytics-v2-project-list-polish',
    'analytics-v2-overview-clean',
]:
    text = re.sub(
        rf'\s*<style id="{re.escape(style_id)}">.*?</style>',
        '',
        text,
        flags=re.S,
    )

canonical_css = r'''
    <style id="analytics-v2-overview-clean">
      .analytics-grid > section {
        display: flex;
        min-width: 0;
        flex-direction: column;
      }
      .analytics-overview-list {
        margin: 16px -16px -16px;
        border-top: 1px solid var(--secondaryBorder, #e5e5e5);
        padding: 14px 16px 16px;
      }
      .analytics-overview-heading {
        margin-bottom: 8px;
      }
      .analytics-overview-heading h3 {
        color: var(--primaryDarkContent, #071331);
        font-size: 13px;
        font-weight: 700;
        line-height: 1.3;
      }
      .analytics-overview-heading p {
        margin-top: 2px;
        color: var(--secondaryContent, #666);
        font-size: 10px;
        line-height: 1.35;
      }
      .analytics-overview-items {
        background: transparent;
      }
      .analytics-overview-row {
        display: grid;
        min-height: 64px;
        grid-template-columns: minmax(0, 1fr) auto;
        align-items: center;
        gap: 8px;
        border: 0;
        border-radius: 6px;
        padding: 0 8px;
        transition: background-color 0.15s ease;
      }
      .analytics-overview-row:hover,
      .analytics-overview-row:focus-within {
        background: var(--primary3XlSoftBg, #f7f8fa);
      }
      .analytics-overview-main {
        display: flex;
        min-width: 0;
        align-items: center;
        gap: 10px;
      }
      .analytics-overview-thumb {
        width: 40px;
        height: 40px;
        flex: 0 0 40px;
        overflow: hidden;
        border: 0;
        background: var(--neutralSoftBg, #f5f6f7);
      }
      .analytics-overview-thumb img,
      .analytics-overview-thumb svg {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .analytics-overview-copy {
        min-width: 0;
        flex: 1 1 auto;
      }
      .analytics-overview-name,
      .analytics-overview-meta {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .analytics-overview-name {
        color: var(--primaryDarkContent, #071331);
      }
      .analytics-overview-meta {
        color: var(--secondaryContent, #666);
      }
      .analytics-overview-value {
        color: var(--primaryDarkContent, #071331);
        text-align: right;
        white-space: nowrap;
      }
      .analytics-overview-value small {
        display: block;
        color: var(--secondaryContent, #666);
      }
      .analytics-overview-more {
        display: flex;
        width: max-content;
        min-height: 32px;
        align-items: center;
        justify-content: center;
        margin: 12px auto 0;
        border: 1px solid var(--secondaryBorder, #e5e5e5);
        border-radius: 8px;
        padding: 6px 12px;
        background: var(--secondarySurface, #fff);
        color: var(--primaryDarkContent, #071331);
        font-size: 11px;
        font-weight: 600;
        transition: background-color 0.15s ease, border-color 0.15s ease;
      }
      .analytics-overview-more:hover,
      .analytics-overview-more:focus-visible {
        border-color: var(--primaryBorder, #9ca1ad);
        background: var(--neutralSoftBg, #f0f2f4);
      }
      .analytics-overview-more:focus-visible,
      .analytics-overview-menu:focus-visible {
        outline: 2px solid var(--accentBorder, #1260eb);
        outline-offset: 2px;
      }

      [data-overview-kind="projects"] .analytics-overview-items {
        border: 0;
      }
      [data-overview-kind="projects"] .analytics-overview-name {
        font-size: 13px;
        font-weight: 650;
        line-height: 1.3;
      }
      [data-overview-kind="projects"] .analytics-overview-thumb {
        border-radius: 7px;
      }
      [data-overview-kind="projects"] .analytics-overview-thumb.is-artist-page {
        border-radius: 999px;
      }
      .analytics-overview-project-metrics {
        display: flex;
        min-width: 0;
        flex-wrap: wrap;
        gap: 4px 12px;
        margin-top: 4px;
        color: var(--secondaryContent, #666);
        font-size: 10px;
        font-weight: 500;
        line-height: 1.25;
      }
      .analytics-overview-project-metric {
        white-space: nowrap;
      }
      .analytics-overview-project-metric strong {
        color: var(--primaryDarkContent, #071331);
        font-size: 11px;
        font-weight: 700;
      }

      [data-overview-kind="tracks"] .analytics-overview-heading {
        margin-bottom: 10px;
      }
      [data-overview-kind="tracks"] .analytics-overview-items {
        overflow: visible;
        border: 0;
      }
      [data-overview-kind="tracks"] .analytics-overview-row {
        grid-template-columns: minmax(0, 1fr) auto auto;
      }
      [data-overview-kind="tracks"] .analytics-overview-main {
        gap: 8px;
      }
      [data-overview-kind="tracks"] .analytics-overview-thumb {
        border-radius: 4px;
      }
      [data-overview-kind="tracks"] .analytics-overview-copy {
        padding: 0 2px;
      }
      [data-overview-kind="tracks"] .analytics-overview-name {
        font-size: 14px;
        font-weight: 600;
        line-height: 1.35;
      }
      [data-overview-kind="tracks"] .analytics-overview-meta {
        margin-top: 1px;
        font-size: 13px;
        line-height: 1.35;
      }
      [data-overview-kind="tracks"] .analytics-overview-value {
        min-width: 58px;
        padding-right: 2px;
        font-size: 12px;
        font-weight: 600;
        line-height: 1.25;
      }
      [data-overview-kind="tracks"] .analytics-overview-value small {
        margin-top: 2px;
        font-size: 9px;
        font-weight: 500;
      }
      [data-overview-kind="tracks"] .analytics-overview-more {
        min-height: 40px;
        margin-top: 6px;
      }
      .analytics-overview-menu {
        display: inline-flex;
        width: 40px;
        height: 40px;
        min-width: 40px;
        align-items: center;
        justify-content: center;
        border: 0;
        border-radius: 6px;
        background: transparent;
        color: var(--primaryDarkContent, #071331);
        cursor: pointer;
      }
      .analytics-overview-menu:hover,
      .analytics-overview-menu:focus-visible {
        background: var(--neutralSoftBg, #f5f6f7);
      }
      .analytics-overview-menu svg {
        width: 20px;
        height: 20px;
        fill: currentColor;
      }

      @media (max-width: 640px) {
        .analytics-overview-list {
          margin: 14px -12px -12px;
          padding: 12px 12px 10px;
        }
        .analytics-overview-heading {
          margin-bottom: 7px;
        }
        .analytics-overview-heading p {
          display: none;
        }
        [data-overview-kind="projects"] .analytics-overview-row {
          padding: 0 2px;
        }
        .analytics-overview-project-metrics {
          gap: 3px 9px;
          margin-top: 3px;
          font-size: 9px;
        }
        .analytics-overview-project-metric strong {
          font-size: 10px;
        }
        [data-overview-kind="tracks"] {
          margin-right: -16px;
          margin-left: -16px;
          padding-right: 0;
          padding-left: 0;
        }
        [data-overview-kind="tracks"] .analytics-overview-heading {
          padding-right: 16px;
          padding-left: 16px;
        }
        [data-overview-kind="tracks"] .analytics-overview-row {
          gap: 6px;
          border-radius: 0;
          padding: 0 16px;
        }
        [data-overview-kind="tracks"] .analytics-overview-value {
          min-width: 48px;
          padding-right: 0;
        }
        [data-overview-kind="tracks"] .analytics-overview-more {
          width: calc(100% - 32px);
          margin-right: 16px;
          margin-left: 16px;
        }
      }
      @media (max-width: 380px) {
        .analytics-overview-project-metrics {
          gap: 2px 7px;
          font-size: 8.5px;
        }
        [data-overview-kind="tracks"] {
          margin-right: -12px;
          margin-left: -12px;
        }
        [data-overview-kind="tracks"] .analytics-overview-heading,
        [data-overview-kind="tracks"] .analytics-overview-row {
          padding-right: 12px;
          padding-left: 12px;
        }
        [data-overview-kind="tracks"] .analytics-overview-name {
          font-size: 13px;
        }
        [data-overview-kind="tracks"] .analytics-overview-meta {
          font-size: 12px;
        }
        [data-overview-kind="tracks"] .analytics-overview-more {
          width: calc(100% - 24px);
          margin-right: 12px;
          margin-left: 12px;
        }
      }
    </style>
'''
text = text.replace('</head>', canonical_css + '\n  </head>', 1)

# Replace the legacy analytics script + layered overview script with one data-driven implementation.
clean_script = r'''
    <script id="analytics-v2-app">
      (() => {
        const numberFormat = new Intl.NumberFormat("en-US");
        const periodFilter = document.getElementById("period-filter");
        const hubFilter = document.getElementById("hub-filter");
        const workspaceTotals = [
          document.getElementById("workspace-openings-total"),
          document.getElementById("workspace-streams-total"),
          document.getElementById("workspace-downloads-total"),
        ].filter(Boolean);
        const chartArea = document.getElementById("hub-chart-area");
        const chartLine = document.getElementById("hub-chart-line");
        const hubChart = document.getElementById("hub-chart");
        const displayTotal = document.getElementById("hub-display-total");
        const primaryNavigation = document.getElementById("primary-navigation");
        const mobileNavOpen = document.getElementById("mobile-nav-open");
        const mobileNavClose = document.getElementById("mobile-nav-close");
        const grid = document.querySelector(".analytics-grid");
        const columns = grid ? [...grid.children].filter((node) => node.tagName === "SECTION") : [];
        const workspace = columns[0];
        const hubsColumn = columns[1];
        const legacyProjects = grid?.nextElementSibling;
        const legacyTracks = document.getElementById("top-discovery-tracks");
        if (!grid || !workspace || !hubsColumn || !legacyProjects || !legacyTracks) return;

        const periods = {
          all: { factor: 1, axis: ["May 2022", "Jan 2025", "Today"] },
          week: { factor: 0.035, axis: ["21 Aug", "24 Aug", "Today"] },
          month: { factor: 0.13, axis: ["28 Jul", "12 Aug", "Today"] },
          year: { factor: 0.62, axis: ["Aug 2025", "Feb 2026", "Today"] },
        };
        const hubNames = {
          all: "All Hubs",
          sync: "Bridge Sync",
          library: "Bridge Library",
          score: "Bridge Score",
        };
        const chartSeries = {
          all: "M42 128 C92 112 126 98 166 86 S240 73 290 62 S365 49 418 45 S500 45 552 45",
          sync: "M42 128 C92 119 126 104 166 94 S240 76 290 70 S365 57 418 52 S500 48 552 40",
          library: "M42 128 C92 121 126 112 166 101 S240 92 290 78 S365 72 418 61 S500 56 552 53",
          score: "M42 128 C92 124 126 115 166 110 S240 96 290 92 S365 80 418 76 S500 67 552 64",
        };
        const hubPatterns = [
          ["sync", "library", "score"],
          ["sync", "library"],
          ["sync"],
          ["library"],
          ["score"],
          ["sync", "score"],
          ["library", "score"],
        ];
        let currentPeriod = periodFilter?.value || "all";
        let currentHub = hubFilter?.value || "all";

        const text = (node) => node ? node.textContent.replace(/\s+/g, " ").trim() : "";
        const numeric = (value) => Number(String(value || "").replace(/[^0-9]/g, "")) || 0;
        const scaled = (value) => Math.max(1, Math.round(value * periods[currentPeriod].factor));

        const cloneThumb = (source) => {
          if (!source) return null;
          const clone = source.cloneNode(true);
          clone.removeAttribute("class");
          clone.removeAttribute("width");
          clone.removeAttribute("height");
          clone.setAttribute("aria-hidden", "true");
          if (clone.tagName === "IMG") clone.alt = "";
          return clone;
        };

        const projects = [...legacyProjects.querySelectorAll(".activity-card")]
          .map((card) => {
            const values = [...card.querySelectorAll(".rounded-xl.bg-white p")].map((node) => numeric(node.textContent));
            const image = card.querySelector("img");
            return {
              name: text(card.querySelector("p.truncate")),
              thumb: cloneThumb(card.querySelector("img, svg")),
              isArtistPage: Boolean(image?.classList.contains("rounded-full") || image?.classList.contains("rounded-360")),
              metrics: [
                { label: "openings", value: values[0] || 0 },
                { label: "streams", value: values[1] || 0 },
                { label: "downloads", value: values[2] || 0 },
              ],
            };
          })
          .filter((item) => item.name);

        const distribute = (total, hubs, index) => {
          const baseWeights = { sync: 0.5, library: 0.31, score: 0.19 };
          const weights = hubs.map((hub, hubIndex) =>
            Math.max(0.08, baseWeights[hub] + (((index + hubIndex) % 3) - 1) * 0.035),
          );
          const weightTotal = weights.reduce((sum, value) => sum + value, 0);
          let remaining = total;
          return hubs.reduce((result, hub, hubIndex) => {
            const value = hubIndex === hubs.length - 1
              ? remaining
              : Math.max(1, Math.round((total * weights[hubIndex]) / weightTotal));
            result[hub] = value;
            remaining -= value;
            return result;
          }, {});
        };

        const tracks = [...legacyTracks.querySelectorAll(".analytics-track-row")]
          .map((row, index) => {
            const allDisplay = Number(row.dataset.display) || 0;
            const assignedHubs = hubPatterns[index % hubPatterns.length];
            const split = distribute(allDisplay, assignedHubs, index);
            const hubMetrics = { all: allDisplay };
            assignedHubs.forEach((hub) => { hubMetrics[hub] = split[hub]; });
            const nameNode = row.querySelector('[data-testid="list-track-name"]');
            return {
              name: text(nameNode),
              artist: text(row.querySelector('[data-testid="list-artist-name"]')),
              thumb: cloneThumb(nameNode?.closest('[data-testid="list-cell"]')?.querySelector("img, svg")),
              originalIndex: index,
              hubMetrics,
            };
          })
          .filter((item) => item.name);

        const workspaceAllTime = workspaceTotals.map((node) => numeric(node.textContent));

        // The legacy sections are now only migration inputs. Remove them immediately after building the model.
        legacyProjects.remove();
        legacyTracks.remove();

        const createThumb = (source, round = false) => {
          const wrap = document.createElement("div");
          wrap.className = `analytics-overview-thumb${round ? " is-artist-page" : ""}`;
          if (source) wrap.appendChild(source.cloneNode(true));
          return wrap;
        };

        const createPanel = ({ title, description, kind }) => {
          const panel = document.createElement("div");
          panel.className = "analytics-overview-list";
          panel.dataset.overviewKind = kind;
          const heading = document.createElement("div");
          heading.className = "analytics-overview-heading";
          const h3 = document.createElement("h3");
          h3.textContent = title;
          heading.appendChild(h3);
          const p = document.createElement("p");
          p.textContent = description;
          heading.appendChild(p);
          panel.appendChild(heading);
          const list = document.createElement("div");
          list.className = "analytics-overview-items";
          panel.appendChild(list);
          const more = document.createElement("button");
          more.type = "button";
          more.className = "analytics-overview-more";
          panel.appendChild(more);
          return { panel, list, more };
        };

        const projectPanel = createPanel({
          title: "Most active projects",
          description: "Projects generating the most activity in your workspace.",
          kind: "projects",
        });
        const trackPanel = createPanel({
          title: "Most displayed tracks",
          description: "Tracks ranked by visibility across the selected Discovery Hubs.",
          kind: "tracks",
        });
        workspace.appendChild(projectPanel.panel);
        hubsColumn.appendChild(trackPanel.panel);

        const visibleState = { projects: 5, tracks: 5 };
        const renderMoreState = (button, visible, total) => {
          const hasMore = visible < total;
          button.hidden = total <= 5;
          button.textContent = hasMore ? "Show more" : "Show less";
          button.setAttribute("aria-expanded", String(!hasMore));
        };

        const renderProjects = () => {
          projectPanel.list.replaceChildren();
          projects.slice(0, visibleState.projects).forEach((item) => {
            const row = document.createElement("div");
            row.className = "analytics-overview-row";
            const main = document.createElement("div");
            main.className = "analytics-overview-main";
            main.appendChild(createThumb(item.thumb, item.isArtistPage));
            const copy = document.createElement("div");
            copy.className = "analytics-overview-copy";
            const name = document.createElement("div");
            name.className = "analytics-overview-name";
            name.textContent = item.name;
            copy.appendChild(name);
            const metrics = document.createElement("div");
            metrics.className = "analytics-overview-project-metrics";
            item.metrics.forEach((metric) => {
              const span = document.createElement("span");
              span.className = "analytics-overview-project-metric";
              const strong = document.createElement("strong");
              strong.textContent = numberFormat.format(scaled(metric.value));
              span.append(strong, ` ${metric.label}`);
              metrics.appendChild(span);
            });
            copy.appendChild(metrics);
            main.appendChild(copy);
            row.appendChild(main);
            projectPanel.list.appendChild(row);
          });
          renderMoreState(projectPanel.more, visibleState.projects, projects.length);
        };

        const visibleTracks = () => tracks
          .filter((item) => currentHub === "all" || item.hubMetrics[currentHub] != null)
          .map((item) => ({ ...item, display: scaled(item.hubMetrics[currentHub]) }))
          .sort((a, b) => b.display - a.display || a.originalIndex - b.originalIndex);

        const renderTracks = () => {
          const items = visibleTracks();
          trackPanel.list.replaceChildren();
          items.slice(0, visibleState.tracks).forEach((item) => {
            const row = document.createElement("div");
            row.className = "analytics-overview-row";
            const main = document.createElement("div");
            main.className = "analytics-overview-main";
            main.appendChild(createThumb(item.thumb));
            const copy = document.createElement("div");
            copy.className = "analytics-overview-copy";
            const name = document.createElement("div");
            name.className = "analytics-overview-name";
            name.textContent = item.name;
            const meta = document.createElement("div");
            meta.className = "analytics-overview-meta";
            meta.textContent = item.artist;
            copy.append(name, meta);
            main.appendChild(copy);
            const value = document.createElement("div");
            value.className = "analytics-overview-value";
            value.textContent = numberFormat.format(item.display);
            const small = document.createElement("small");
            small.textContent = "displays";
            value.appendChild(small);
            const menu = document.createElement("button");
            menu.type = "button";
            menu.className = "analytics-overview-menu";
            menu.setAttribute("aria-label", `More options for ${item.name}`);
            menu.innerHTML = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 10a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM8.5 10a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM15.5 8.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z"></path></svg>';
            row.append(main, value, menu);
            trackPanel.list.appendChild(row);
          });
          renderMoreState(trackPanel.more, visibleState.tracks, items.length);
        };

        projectPanel.more.addEventListener("click", () => {
          visibleState.projects = visibleState.projects < projects.length ? Math.min(visibleState.projects + 5, projects.length) : 5;
          renderProjects();
        });
        trackPanel.more.addEventListener("click", () => {
          const count = visibleTracks().length;
          visibleState.tracks = visibleState.tracks < count ? Math.min(visibleState.tracks + 5, count) : 5;
          renderTracks();
        });

        const updateChart = () => {
          const total = visibleTracks().reduce((sum, item) => sum + item.display, 0);
          if (displayTotal) displayTotal.textContent = numberFormat.format(total);
          const path = chartSeries[currentHub];
          chartLine?.setAttribute("d", path);
          chartArea?.setAttribute("d", `${path} L552 128H42Z`);
          hubChart?.setAttribute("aria-label", `Displays on ${hubNames[currentHub]}`);
        };

        const updatePeriod = () => {
          currentPeriod = periodFilter?.value || "all";
          workspaceTotals.forEach((node, index) => {
            node.textContent = numberFormat.format(scaled(workspaceAllTime[index]));
          });
          const axis = periods[currentPeriod].axis;
          document.querySelectorAll(".period-axis-start").forEach((node) => { node.textContent = axis[0]; });
          document.querySelectorAll(".period-axis-middle").forEach((node) => { node.textContent = axis[1]; });
          document.querySelectorAll(".period-axis-end").forEach((node) => { node.textContent = axis[2]; });
          visibleState.projects = 5;
          visibleState.tracks = 5;
          renderProjects();
          renderTracks();
          updateChart();
        };

        const updateHub = () => {
          currentHub = hubFilter?.value || "all";
          visibleState.tracks = 5;
          renderTracks();
          updateChart();
        };

        periodFilter?.addEventListener("change", updatePeriod);
        hubFilter?.addEventListener("change", updateHub);
        document.querySelectorAll(".metric-row button.metric-cta").forEach((button) => {
          button.addEventListener("click", () => {
            button.closest(".metric-row")?.querySelectorAll(".metric-cta").forEach((item) => {
              const active = item === button;
              item.setAttribute("aria-pressed", String(active));
              item.classList.toggle("bg-secondarySurface", active);
              item.classList.toggle("shadow", active);
              item.classList.toggle("bg-neutralSoftBg", !active);
            });
          });
        });

        const setMobileNavigation = (open, restoreFocus = true) => {
          if (!primaryNavigation || !mobileNavOpen || !mobileNavClose) return;
          primaryNavigation.classList.toggle("mobile-nav-open", open);
          document.body.classList.toggle("mobile-menu-open", open);
          mobileNavOpen.setAttribute("aria-expanded", String(open));
          if (window.innerWidth < 768) primaryNavigation.setAttribute("aria-hidden", String(!open));
          else primaryNavigation.removeAttribute("aria-hidden");
          if (open) {
            primaryNavigation.scrollTop = 0;
            mobileNavClose.focus();
          } else if (restoreFocus && window.innerWidth < 768) {
            mobileNavOpen.focus();
          }
        };
        mobileNavOpen?.addEventListener("click", () => setMobileNavigation(true));
        mobileNavClose?.addEventListener("click", () => setMobileNavigation(false));
        primaryNavigation?.querySelectorAll("a").forEach((link) => {
          link.addEventListener("click", () => setMobileNavigation(false, false));
        });
        document.addEventListener("keydown", (event) => {
          if (event.key === "Escape" && primaryNavigation?.classList.contains("mobile-nav-open")) setMobileNavigation(false);
        });
        window.addEventListener("resize", () => {
          if (window.innerWidth >= 768 && primaryNavigation?.classList.contains("mobile-nav-open")) setMobileNavigation(false, false);
        });
        if (window.innerWidth < 768) primaryNavigation?.setAttribute("aria-hidden", "true");

        grid.dataset.overviewMounted = "true";
        updatePeriod();
      })();
    </script>
'''

pattern = re.compile(
    r'\n\s*<script>\s*\(\(\) => \{.*?</script>\s*<script id="analytics-v2-overview-layout">.*?</script>',
    re.S,
)
text, count = pattern.subn(lambda _: '\n' + clean_script, text, count=1)
if count != 1:
    raise SystemExit(f'Expected to replace analytics scripts once, replaced {count}')

# Validation: one canonical custom overview style, one canonical analytics script, no iterative patch ids.
if text.count('id="analytics-v2-overview-clean"') != 1:
    raise SystemExit('Canonical overview style validation failed')
if text.count('id="analytics-v2-app"') != 1:
    raise SystemExit('Canonical analytics script validation failed')
for obsolete in [
    'analytics-v2-compact-tracklist',
    'analytics-v2-polish-pass',
    'analytics-v2-mobile-tracklist-principles',
    'analytics-v2-row-harmonization',
    'analytics-v2-project-list-polish',
    'analytics-v2-overview-layout',
]:
    if obsolete in text:
        raise SystemExit(f'Obsolete layer remains: {obsolete}')

path.write_text(text)
