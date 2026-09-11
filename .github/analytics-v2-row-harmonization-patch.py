from pathlib import Path

path = Path('analytics/v2/index.html')
text = path.read_text()
marker = 'analytics-v2-row-harmonization'
if marker in text:
    raise SystemExit(0)

css = r'''
    <style id="analytics-v2-row-harmonization">
      [data-overview-kind="projects"] .analytics-overview-row,
      [data-overview-kind="tracks"] .analytics-overview-row {
        min-height: 64px;
      }
      [data-overview-kind="projects"] .analytics-overview-row {
        padding-top: 0;
        padding-bottom: 0;
      }
      [data-overview-kind="projects"] .analytics-overview-thumb {
        width: 40px;
        height: 40px;
        flex-basis: 40px;
      }
      [data-overview-kind="tracks"] .analytics-overview-row {
        grid-template-columns: minmax(0, 1fr) auto auto;
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
      .analytics-overview-menu:focus-visible {
        outline: 2px solid var(--accentBorder, #1260eb);
        outline-offset: 2px;
      }
      .analytics-overview-menu svg {
        width: 20px;
        height: 20px;
        fill: currentColor;
      }
      @media (max-width: 640px) {
        [data-overview-kind="projects"] .analytics-overview-row,
        [data-overview-kind="tracks"] .analytics-overview-row {
          min-height: 64px;
        }
        [data-overview-kind="projects"] .analytics-overview-thumb {
          width: 40px;
          height: 40px;
          flex-basis: 40px;
        }
        [data-overview-kind="tracks"] .analytics-overview-row {
          gap: 6px;
        }
        [data-overview-kind="tracks"] .analytics-overview-value {
          min-width: 48px;
        }
      }
    </style>
'''

text = text.replace('</head>', css + '\n  </head>', 1)

old = '''              if (item.value) {\n                const value = document.createElement("div");\n                value.className = "analytics-overview-value";\n                value.textContent = item.value;\n                if (item.valueLabel) {\n                  const small = document.createElement("small");\n                  small.textContent = item.valueLabel;\n                  value.appendChild(small);\n                }\n                row.appendChild(value);\n              }\n              list.appendChild(row);'''
new = '''              if (item.value) {\n                const value = document.createElement("div");\n                value.className = "analytics-overview-value";\n                value.textContent = item.value;\n                if (item.valueLabel) {\n                  const small = document.createElement("small");\n                  small.textContent = item.valueLabel;\n                  value.appendChild(small);\n                }\n                row.appendChild(value);\n              }\n              if (kind === "tracks") {\n                const menu = document.createElement("button");\n                menu.type = "button";\n                menu.className = "analytics-overview-menu";\n                menu.setAttribute("aria-label", `More options for ${item.name}`);\n                menu.innerHTML = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 10a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM8.5 10a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM15.5 8.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z"></path></svg>';\n                row.appendChild(menu);\n              }\n              list.appendChild(row);'''

if old not in text:
    raise SystemExit('render block not found')
text = text.replace(old, new, 1)
path.write_text(text)
