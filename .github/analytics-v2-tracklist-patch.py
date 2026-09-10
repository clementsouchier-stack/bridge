from pathlib import Path

path = Path('analytics/v2/index.html')
text = path.read_text()
marker = 'analytics-v2-compact-tracklist'
if marker in text:
    raise SystemExit(0)

css = r'''
    <style id="analytics-v2-compact-tracklist">
      [data-overview-kind="tracks"] .analytics-overview-heading {
        margin-bottom: 12px;
      }
      [data-overview-kind="tracks"] .analytics-overview-items {
        overflow: hidden;
        border: 1px solid var(--secondaryBorder, #e5e5e5);
        border-radius: 10px;
        background: var(--secondarySurface, #fff);
      }
      [data-overview-kind="tracks"] .analytics-overview-row {
        min-height: 58px;
        border-bottom: 1px solid var(--secondaryBorder, #e5e5e5);
        padding: 8px 10px;
        transition: background-color 0.15s ease;
      }
      [data-overview-kind="tracks"] .analytics-overview-row:last-child {
        border-bottom: 0;
      }
      [data-overview-kind="tracks"] .analytics-overview-row:hover {
        background: var(--primary3XlSoftBg, #f7f8fa);
      }
      [data-overview-kind="tracks"] .analytics-overview-main {
        gap: 10px;
      }
      [data-overview-kind="tracks"] .analytics-overview-thumb {
        width: 40px;
        height: 40px;
        flex-basis: 40px;
        border-radius: 5px;
      }
      [data-overview-kind="tracks"] .analytics-overview-name {
        font-size: 12px;
        line-height: 1.3;
      }
      [data-overview-kind="tracks"] .analytics-overview-meta {
        margin-top: 3px;
        font-size: 10px;
      }
      [data-overview-kind="tracks"] .analytics-overview-value {
        min-width: 62px;
        font-size: 12px;
        line-height: 1.2;
      }
      [data-overview-kind="tracks"] .analytics-overview-value small {
        margin-top: 3px;
        font-size: 9px;
      }
      [data-overview-kind="tracks"] .analytics-overview-more {
        margin-top: 8px;
      }
      @media (max-width: 640px) {
        [data-overview-kind="tracks"] .analytics-overview-heading p {
          max-width: 34ch;
        }
        [data-overview-kind="tracks"] .analytics-overview-items {
          border-right: 0;
          border-left: 0;
          border-radius: 0;
        }
        [data-overview-kind="tracks"] .analytics-overview-row {
          min-height: 62px;
          gap: 8px;
          margin: 0;
          padding: 9px 0;
        }
        [data-overview-kind="tracks"] .analytics-overview-thumb {
          width: 42px;
          height: 42px;
          flex-basis: 42px;
          border-radius: 5px;
        }
        [data-overview-kind="tracks"] .analytics-overview-name {
          font-size: 12px;
        }
        [data-overview-kind="tracks"] .analytics-overview-meta {
          font-size: 10px;
        }
        [data-overview-kind="tracks"] .analytics-overview-value {
          min-width: 56px;
          font-size: 11px;
        }
      }
      @media (max-width: 380px) {
        [data-overview-kind="tracks"] .analytics-overview-row {
          grid-template-columns: minmax(0, 1fr) 52px;
        }
        [data-overview-kind="tracks"] .analytics-overview-thumb {
          width: 38px;
          height: 38px;
          flex-basis: 38px;
        }
      }
    </style>
'''

text = text.replace('</head>', css + '\n  </head>', 1)
path.write_text(text)
