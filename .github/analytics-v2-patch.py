from pathlib import Path

path = Path("analytics/v2/index.html")
text = path.read_text()
marker = "analytics-v2-overview-layout"
if marker in text:
    raise SystemExit(0)

css = r'''
      /* analytics-v2-overview-layout */
      .analytics-grid > section {
        display: flex;
        min-width: 0;
        flex-direction: column;
      }
      .analytics-overview-list {
        margin: 20px -16px -16px;
        border-top: 1px solid var(--secondaryBorder, #e5e5e5);
        padding: 16px;
      }
      .analytics-overview-heading {
        margin-bottom: 10px;
      }
      .analytics-overview-heading h3 {
        color: var(--primaryDarkContent, #071331);
        font-size: 14px;
        font-weight: 700;
        line-height: 1.35;
      }
      .analytics-overview-heading p {
        margin-top: 3px;
        color: var(--secondaryContent, #666);
        font-size: 11px;
        line-height: 1.4;
      }
      .analytics-overview-items {
        border-top: 1px solid var(--secondaryBorder, #e5e5e5);
      }
      .analytics-overview-row {
        display: grid;
        min-height: 58px;
        grid-template-columns: minmax(0, 1fr) auto;
        align-items: center;
        gap: 12px;
        border-bottom: 1px solid var(--secondaryBorder, #e5e5e5);
        padding: 8px 0;
      }
      .analytics-overview-main {
        display: flex;
        min-width: 0;
        align-items: center;
        gap: 10px;
      }
      .analytics-overview-thumb {
        width: 38px;
        height: 38px;
        flex: 0 0 38px;
        overflow: hidden;
        border: 1px solid var(--secondaryBorder, #e5e5e5);
        border-radius: 7px;
        background: var(--neutralSoftBg, #f5f6f7);
        object-fit: cover;
      }
      .analytics-overview-thumb svg,
      .analytics-overview-thumb img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .analytics-overview-copy {
        min-width: 0;
      }
      .analytics-overview-name {
        overflow: hidden;
        color: var(--primaryDarkContent, #071331);
        font-size: 12px;
        font-weight: 700;
        line-height: 1.35;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .analytics-overview-meta {
        overflow: hidden;
        margin-top: 2px;
        color: var(--secondaryContent, #666);
        font-size: 10px;
        line-height: 1.35;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .analytics-overview-value {
        color: var(--primaryDarkContent, #071331);
        font-size: 11px;
        font-weight: 700;
        line-height: 1.3;
        text-align: right;
        white-space: nowrap;
      }
      .analytics-overview-value small {
        display: block;
        margin-top: 2px;
        color: var(--secondaryContent, #666);
        font-size: 9px;
        font-weight: 500;
      }
      .analytics-overview-more {
        display: flex;
        width: 100%;
        min-height: 40px;
        align-items: center;
        justify-content: center;
        margin-top: 4px;
        border-radius: 8px;
        color: var(--primaryDarkContent, #071331);
        font-size: 11px;
        font-weight: 700;
      }
      .analytics-overview-more:hover,
      .analytics-overview-more:focus-visible {
        background: var(--neutralSoftBg, #f5f6f7);
      }
      .analytics-overview-more:focus-visible {
        outline: 2px solid var(--accentBorder, #1260eb);
        outline-offset: 2px;
      }
      @media (max-width: 640px) {
        .analytics-overview-list {
          margin-top: 16px;
          padding-top: 14px;
        }
        .analytics-overview-row {
          min-height: 60px;
        }
        .analytics-overview-thumb {
          width: 36px;
          height: 36px;
          flex-basis: 36px;
        }
      }
'''

js = r'''
    <script id="analytics-v2-overview-layout">
      (() => {
        const DEFAULT_VISIBLE = 5;
        const STEP = 5;

        function text(node) {
          return node ? node.textContent.replace(/\s+/g, " ").trim() : "";
        }

        function createThumb(source) {
          const wrap = document.createElement("div");
          wrap.className = "analytics-overview-thumb";
          if (!source) return wrap;
          const clone = source.cloneNode(true);
          clone.removeAttribute("class");
          clone.removeAttribute("width");
          clone.removeAttribute("height");
          clone.setAttribute("aria-hidden", "true");
          if (clone.tagName === "IMG") clone.alt = "";
          wrap.appendChild(clone);
          return wrap;
        }

        function makePanel({ title, description, items, kind }) {
          const panel = document.createElement("div");
          panel.className = "analytics-overview-list";
          panel.dataset.overviewKind = kind;
          const heading = document.createElement("div");
          heading.className = "analytics-overview-heading";
          const h3 = document.createElement("h3");
          h3.textContent = title;
          heading.appendChild(h3);
          if (description) {
            const p = document.createElement("p");
            p.textContent = description;
            heading.appendChild(p);
          }
          panel.appendChild(heading);

          const list = document.createElement("div");
          list.className = "analytics-overview-items";
          panel.appendChild(list);

          let visible = DEFAULT_VISIBLE;
          const button = document.createElement("button");
          button.type = "button";
          button.className = "analytics-overview-more";

          function render() {
            list.replaceChildren();
            items.slice(0, visible).forEach((item) => {
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
              copy.appendChild(name);
              if (item.meta) {
                const meta = document.createElement("div");
                meta.className = "analytics-overview-meta";
                meta.textContent = item.meta;
                copy.appendChild(meta);
              }
              main.appendChild(copy);
              row.appendChild(main);
              if (item.value) {
                const value = document.createElement("div");
                value.className = "analytics-overview-value";
                value.textContent = item.value;
                if (item.valueLabel) {
                  const small = document.createElement("small");
                  small.textContent = item.valueLabel;
                  value.appendChild(small);
                }
                row.appendChild(value);
              }
              list.appendChild(row);
            });
            const hasMore = visible < items.length;
            button.hidden = items.length <= DEFAULT_VISIBLE;
            button.textContent = hasMore ? "Show more" : "Show less";
            button.setAttribute("aria-expanded", String(!hasMore));
          }

          button.addEventListener("click", () => {
            visible = visible < items.length ? Math.min(visible + STEP, items.length) : DEFAULT_VISIBLE;
            render();
          });
          panel.appendChild(button);
          render();
          return panel;
        }

        function projectItems(sourceSection) {
          return [...sourceSection.querySelectorAll(".activity-card")].map((card) => {
            const metrics = [...card.querySelectorAll(".rounded-xl.bg-white p")].map(text);
            const openings = metrics[0] ? metrics[0].replace(/link visits?/i, "").trim() : "";
            return {
              name: text(card.querySelector("p.truncate")),
              meta: [metrics[1], metrics[2]].filter(Boolean).join(" · "),
              value: openings,
              valueLabel: openings ? "openings" : "",
              thumb: card.querySelector("img, svg"),
            };
          }).filter((item) => item.name);
        }

        function trackItems(sourceSection) {
          return [...sourceSection.querySelectorAll(".analytics-track-row")].map((row) => ({
            name: text(row.querySelector('[data-testid="list-track-name"]')),
            meta: text(row.querySelector('[data-testid="list-artist-name"]')),
            value: row.dataset.display ? Number(row.dataset.display).toLocaleString("en-US") : "",
            valueLabel: row.dataset.display ? "displays" : "",
            thumb: row.querySelector('[data-testid="list-track-name"]')?.closest('[data-testid="list-cell"]')?.querySelector("img, svg"),
          })).filter((item) => item.name);
        }

        function mount() {
          const grid = document.querySelector(".analytics-grid");
          if (!grid || grid.dataset.overviewMounted === "true") return;
          const columns = [...grid.children].filter((node) => node.tagName === "SECTION");
          const workspace = columns[0];
          const hubs = columns[1];
          const legacyProjects = grid.nextElementSibling;
          const legacyTracks = document.querySelector("#top-discovery-tracks");
          if (!workspace || !hubs || !legacyProjects || !legacyTracks) return;
          const projects = projectItems(legacyProjects);
          const tracks = trackItems(legacyTracks);
          if (!projects.length || !tracks.length) return;

          workspace.appendChild(makePanel({
            title: "Most active projects",
            description: "Projects generating the most activity in your workspace.",
            items: projects,
            kind: "projects",
          }));
          hubs.appendChild(makePanel({
            title: "Top tracks",
            description: "Your most visible tracks across the selected Discovery Hubs.",
            items: tracks,
            kind: "tracks",
          }));

          legacyProjects.hidden = true;
          legacyTracks.hidden = true;
          grid.dataset.overviewMounted = "true";

          const refreshTracks = () => window.setTimeout(() => {
            const old = hubs.querySelector('[data-overview-kind="tracks"]');
            const nextItems = trackItems(legacyTracks);
            if (!old || !nextItems.length) return;
            old.replaceWith(makePanel({
              title: "Top tracks",
              description: "Your most visible tracks across the selected Discovery Hubs.",
              items: nextItems,
              kind: "tracks",
            }));
          }, 0);

          document.querySelector("#hub-filter")?.addEventListener("change", refreshTracks);
          document.querySelector("#top-tracks-hub-filter")?.addEventListener("change", refreshTracks);
          document.querySelector("#sort-display")?.addEventListener("click", refreshTracks);
        }

        if (document.readyState === "loading") {
          document.addEventListener("DOMContentLoaded", mount, { once: true });
        } else {
          mount();
        }
      })();
    </script>
'''

if "</style>" not in text or "</body>" not in text:
    raise SystemExit("Expected HTML anchors not found")
text = text.replace("</style>", css + "\n    </style>", 1)
text = text.replace("</body>", js + "\n  </body>", 1)
path.write_text(text)
