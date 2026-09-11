from pathlib import Path
import re

path = Path('analytics/v2/index.html')
text = path.read_text()
marker = 'analytics-v2-project-list-polish'
if marker in text:
    raise SystemExit(0)

css = r'''
    <style id="analytics-v2-project-list-polish">
      [data-overview-kind="projects"] .analytics-overview-items {
        border: 0;
        border-radius: 0;
        background: transparent;
      }
      [data-overview-kind="projects"] .analytics-overview-row {
        min-height: 64px;
        border: 0;
        border-radius: 6px;
        padding: 0 8px;
      }
      [data-overview-kind="projects"] .analytics-overview-row:hover,
      [data-overview-kind="projects"] .analytics-overview-row:focus-within {
        background: var(--primary3XlSoftBg, #f7f8fa);
      }
      [data-overview-kind="projects"] .analytics-overview-main {
        align-items: center;
        gap: 10px;
      }
      [data-overview-kind="projects"] .analytics-overview-copy {
        min-width: 0;
        flex: 1 1 auto;
      }
      [data-overview-kind="projects"] .analytics-overview-name {
        font-size: 13px;
        font-weight: 650;
        line-height: 1.3;
      }
      [data-overview-kind="projects"] .analytics-overview-thumb {
        width: 40px;
        height: 40px;
        flex-basis: 40px;
        border: 0;
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
      @media (max-width: 640px) {
        [data-overview-kind="projects"] .analytics-overview-row {
          min-height: 64px;
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
      }
      @media (max-width: 380px) {
        .analytics-overview-project-metrics {
          gap: 2px 7px;
          font-size: 8.5px;
        }
      }
    </style>
'''
text = text.replace('</head>', css + '\n  </head>', 1)

# Make createThumb accept an optional extra class for artist pages.
text = text.replace(
'''        function createThumb(source) {\n          const wrap = document.createElement("div");\n          wrap.className = "analytics-overview-thumb";''',
'''        function createThumb(source, extraClass = "") {\n          const wrap = document.createElement("div");\n          wrap.className = `analytics-overview-thumb${extraClass ? ` ${extraClass}` : ""}`;''',
1,
)

# Use project-specific thumbnail class and render richer metrics below the project name.
text = text.replace(
'''              main.appendChild(createThumb(item.thumb));''',
'''              main.appendChild(createThumb(item.thumb, kind === "projects" && item.isArtistPage ? "is-artist-page" : ""));''',
1,
)

old_meta = '''              if (item.meta) {\n                const meta = document.createElement("div");\n                meta.className = "analytics-overview-meta";\n                meta.textContent = item.meta;\n                copy.appendChild(meta);\n              }'''
new_meta = '''              if (kind === "projects" && item.metrics?.length) {\n                const metrics = document.createElement("div");\n                metrics.className = "analytics-overview-project-metrics";\n                item.metrics.forEach((metric) => {\n                  const span = document.createElement("span");\n                  span.className = "analytics-overview-project-metric";\n                  const strong = document.createElement("strong");\n                  strong.textContent = metric.value;\n                  span.appendChild(strong);\n                  span.append(` ${metric.label}`);\n                  metrics.appendChild(span);\n                });\n                copy.appendChild(metrics);\n              } else if (item.meta) {\n                const meta = document.createElement("div");\n                meta.className = "analytics-overview-meta";\n                meta.textContent = item.meta;\n                copy.appendChild(meta);\n              }'''
if old_meta not in text:
    raise SystemExit('meta render block not found')
text = text.replace(old_meta, new_meta, 1)

# Do not duplicate the openings metric on the right for project rows.
text = text.replace(
'''              if (item.value) {\n                const value = document.createElement("div");''',
'''              if (item.value && kind !== "projects") {\n                const value = document.createElement("div");''',
1,
)

old_projects = '''        function projectItems(sourceSection) {\n          return [...sourceSection.querySelectorAll(".activity-card")].map((card) => {\n            const metrics = [...card.querySelectorAll(".rounded-xl.bg-white p")].map(text);\n            const openings = metrics[0] ? metrics[0].replace(/link visits?/i, "").trim() : "";\n            return {\n              name: text(card.querySelector("p.truncate")),\n              meta: [metrics[1], metrics[2]].filter(Boolean).join(" · "),\n              value: openings,\n              valueLabel: openings ? "openings" : "",\n              thumb: card.querySelector("img, svg"),\n            };\n          }).filter((item) => item.name);\n        }'''
new_projects = '''        function projectItems(sourceSection) {\n          const parseMetric = (raw, fallbackLabel) => {\n            const clean = (raw || "").replace(/link visits?/i, "openings").trim();\n            const match = clean.match(/^([\\d,.\\s]+)\\s*(.*)$/);\n            return {\n              value: match?.[1]?.trim() || clean,\n              label: (match?.[2]?.trim() || fallbackLabel).toLowerCase(),\n            };\n          };\n          return [...sourceSection.querySelectorAll(".activity-card")].map((card) => {\n            const rawMetrics = [...card.querySelectorAll(".rounded-xl.bg-white p")].map(text);\n            const metrics = [\n              parseMetric(rawMetrics[0], "openings"),\n              parseMetric(rawMetrics[1], "streams"),\n              parseMetric(rawMetrics[2], "downloads"),\n            ].filter((metric) => metric.value);\n            const cardText = text(card);\n            const image = card.querySelector("img");\n            const isArtistPage = /artist\\s*page|artist/i.test(cardText) || image?.classList.contains("rounded-full") || image?.classList.contains("rounded-360");\n            return {\n              name: text(card.querySelector("p.truncate")),\n              metrics,\n              thumb: card.querySelector("img, svg"),\n              isArtistPage,\n            };\n          }).filter((item) => item.name);\n        }'''
if old_projects not in text:
    raise SystemExit('projectItems block not found')
text = text.replace(old_projects, new_projects, 1)

path.write_text(text)
