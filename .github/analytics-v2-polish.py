from pathlib import Path

path = Path('analytics/v2/index.html')
text = path.read_text()
marker = 'analytics-v2-polish-pass'
if marker in text:
    raise SystemExit(0)

css = r'''
    <style id="analytics-v2-polish-pass">
      .analytics-overview-list {
        margin-top: 16px;
        padding-top: 14px;
      }
      .analytics-overview-heading {
        margin-bottom: 8px;
      }
      .analytics-overview-heading h3 {
        font-size: 13px;
        line-height: 1.3;
      }
      .analytics-overview-heading p {
        margin-top: 2px;
        font-size: 10px;
        line-height: 1.35;
      }
      .analytics-overview-items {
        overflow: hidden;
        border: 1px solid var(--secondaryBorder, #e5e5e5);
        border-radius: 10px;
        background: var(--secondarySurface, #fff);
      }
      .analytics-overview-row {
        min-height: 56px;
        border-bottom: 1px solid var(--secondaryBorder, #e5e5e5);
        padding: 7px 10px;
        transition: background-color .15s ease;
      }
      .analytics-overview-row:last-child {
        border-bottom: 0;
      }
      .analytics-overview-row:hover {
        background: var(--primary3XlSoftBg, #f7f8fa);
      }
      .analytics-overview-thumb {
        width: 40px;
        height: 40px;
        flex-basis: 40px;
        border-radius: 6px;
      }
      .analytics-overview-main {
        gap: 10px;
      }
      .analytics-overview-name {
        font-size: 12px;
        line-height: 1.25;
      }
      .analytics-overview-meta {
        margin-top: 3px;
        font-size: 10px;
        line-height: 1.25;
      }
      .analytics-overview-value {
        min-width: 58px;
        font-size: 12px;
        line-height: 1.2;
      }
      .analytics-overview-value small {
        margin-top: 3px;
        font-size: 9px;
        line-height: 1.15;
      }
      [data-overview-kind="projects"] .analytics-overview-thumb {
        border-radius: 7px;
      }
      [data-overview-kind="tracks"] .analytics-overview-row {
        min-height: 56px;
      }
      [data-overview-kind="tracks"] .analytics-overview-thumb {
        border-radius: 4px;
      }
      .analytics-overview-more {
        width: max-content;
        min-height: 32px;
        margin: 12px auto 0;
        border: 1px solid var(--secondaryBorder, #e5e5e5);
        border-radius: 8px;
        padding: 6px 12px;
        background: var(--secondarySurface, #fff);
        font-size: 11px;
        font-weight: 600;
        transition: background-color .15s ease, border-color .15s ease;
      }
      .analytics-overview-more:hover,
      .analytics-overview-more:focus-visible {
        background: var(--neutralSoftBg, #f0f2f4);
        border-color: var(--primaryBorder, #9ca1ad);
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
        .analytics-overview-items {
          border-right: 0;
          border-left: 0;
          border-radius: 0;
        }
        .analytics-overview-row {
          min-height: 54px;
          padding: 7px 2px;
        }
        .analytics-overview-thumb,
        [data-overview-kind="tracks"] .analytics-overview-thumb {
          width: 38px;
          height: 38px;
          flex-basis: 38px;
        }
        .analytics-overview-value {
          min-width: 52px;
          font-size: 11px;
        }
        .analytics-overview-more {
          margin-top: 10px;
        }
      }
      @media (max-width: 380px) {
        .analytics-overview-list {
          margin-right: -10px;
          margin-left: -10px;
          padding-right: 10px;
          padding-left: 10px;
        }
        .analytics-overview-row {
          gap: 8px;
        }
        .analytics-overview-main {
          gap: 8px;
        }
      }
    </style>
'''

# Keep the product truth aligned with the available metric: Discovery currently ranks by displays.
text = text.replace('title: "Top tracks",\n            description: "Your most visible tracks across the selected Discovery Hubs."', 'title: "Top tracks",\n            description: "Tracks ranked by visibility across the selected Discovery Hubs."')
text = text.replace('title: "Top tracks",\n              description: "Your most visible tracks across the selected Discovery Hubs."', 'title: "Top tracks",\n              description: "Tracks ranked by visibility across the selected Discovery Hubs."')
text = text.replace('description: "Projects generating the most activity in your workspace."', 'description: "Projects generating the most activity in your workspace."')

if '</head>' not in text:
    raise SystemExit('Expected </head> anchor not found')
text = text.replace('</head>', css + '\n  </head>', 1)
path.write_text(text)
