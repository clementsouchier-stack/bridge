from pathlib import Path

path = Path('analytics/v2/index.html')
text = path.read_text()
marker = 'analytics-v2-mobile-tracklist-principles'
if marker in text:
    raise SystemExit(0)

css = r'''
    <style id="analytics-v2-mobile-tracklist-principles">
      [data-overview-kind="tracks"] .analytics-overview-heading {
        margin-bottom: 10px;
      }
      [data-overview-kind="tracks"] .analytics-overview-items {
        overflow: visible;
        border: 0;
        border-radius: 0;
        background: transparent;
      }
      [data-overview-kind="tracks"] .analytics-overview-row {
        min-height: 64px;
        grid-template-columns: minmax(0, 1fr) auto;
        gap: 8px;
        border: 0;
        border-radius: 6px;
        padding: 0 8px;
        transition: background-color 0.15s ease;
      }
      [data-overview-kind="tracks"] .analytics-overview-row:hover,
      [data-overview-kind="tracks"] .analytics-overview-row:focus-within {
        background: var(--primary3XlSoftBg, #f7f8fa);
      }
      [data-overview-kind="tracks"] .analytics-overview-row:active {
        background: var(--primaryXlSoftBg, #eef1f5);
      }
      [data-overview-kind="tracks"] .analytics-overview-main {
        min-width: 0;
        gap: 8px;
      }
      [data-overview-kind="tracks"] .analytics-overview-thumb {
        width: 40px;
        height: 40px;
        flex: 0 0 40px;
        border: 0;
        border-radius: 4px;
        background: var(--neutralSoftBg, #f5f6f7);
      }
      [data-overview-kind="tracks"] .analytics-overview-copy {
        min-width: 0;
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
      @media (max-width: 640px) {
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
          min-height: 64px;
          border-radius: 0;
          padding: 0 16px;
        }
        [data-overview-kind="tracks"] .analytics-overview-thumb {
          width: 40px;
          height: 40px;
          flex-basis: 40px;
        }
        [data-overview-kind="tracks"] .analytics-overview-value {
          min-width: 52px;
          padding-right: 0;
        }
        [data-overview-kind="tracks"] .analytics-overview-more {
          width: calc(100% - 32px);
          margin-right: 16px;
          margin-left: 16px;
        }
      }
      @media (max-width: 380px) {
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

text = text.replace('</head>', css + '\n  </head>', 1)
text = text.replace('title: "Top tracks"', 'title: "Most displayed tracks"')
text = text.replace('description: "Your most visible tracks across the selected Discovery Hubs."', 'description: "Your most displayed tracks across the selected Discovery Hubs."')
path.write_text(text)
