(() => {
  const STYLE_ID = 'analytics-v2-final-polish';
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    /* Keep both ranking lists on the exact same 64px rhythm and edge padding. */
    [data-overview-kind="projects"] .analytics-overview-row,
    [data-overview-kind="tracks"] .analytics-overview-row {
      box-sizing: border-box;
      min-height: 64px;
      height: 64px;
      padding-left: 8px !important;
      padding-right: 8px !important;
    }
    [data-overview-kind="projects"] .analytics-overview-main,
    [data-overview-kind="tracks"] .analytics-overview-main {
      gap: 8px;
    }
    @media (max-width: 767px) {
      [data-overview-kind="projects"],
      [data-overview-kind="tracks"] {
        margin-left: -12px;
        margin-right: -12px;
      }
      [data-overview-kind="projects"] .analytics-overview-heading,
      [data-overview-kind="tracks"] .analytics-overview-heading,
      [data-overview-kind="projects"] .analytics-overview-row,
      [data-overview-kind="tracks"] .analytics-overview-row {
        padding-left: 12px !important;
        padding-right: 12px !important;
      }
    }
  `;
  document.head.appendChild(style);

  const analyticsUrl = () => location.pathname + location.search;

  /*
   * The baseline detail view writes its share hash with replaceState.
   * Create an Analytics history entry immediately before the baseline click handler
   * runs, so native browser Back returns to Analytics instead of leaving the prototype.
   */
  document.addEventListener('click', (event) => {
    const shareRow = event.target.closest('[data-overview-kind="projects"] .analytics-overview-row.is-share-link');
    if (!shareRow || document.querySelector('.project-reference-overlay')) return;
    history.pushState({ analytics: true }, '', analyticsUrl());
  }, true);

  const closeOverlayForHistory = () => {
    const overlay = document.querySelector('.project-reference-overlay');
    if (!overlay) return;
    overlay.remove();
    document.body.style.overflow = '';
  };

  window.addEventListener('popstate', () => {
    if (!location.hash.startsWith('#share=')) closeOverlayForHistory();
  });

  const enhanceProjectOverlay = (overlay) => {
    if (!overlay || overlay.dataset.finalNavigationReady === 'true') return;
    overlay.dataset.finalNavigationReady = 'true';

    /* Desktop / mobile breadcrumb: Analytics / project name. */
    const header = overlay.querySelector('#header-buttons');
    const projectLink = header && Array.from(header.querySelectorAll('a')).find((link) => link.textContent.trim() === 'Projects');
    if (projectLink) {
      projectLink.textContent = 'Analytics';
      projectLink.setAttribute('data-proto-return-analytics', 'true');
      projectLink.href = '#';
    }

    /* All Analytics exits use the native history entry created before opening. */
    overlay.querySelectorAll('[data-proto-return-analytics]').forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        if (history.length > 1) history.back();
        else {
          closeOverlayForHistory();
          history.replaceState({}, '', analyticsUrl());
        }
      }, true);
    });

    /* Closing Activity reveals the full project; the Activity CTA opens it again. */
    const activityButtons = Array.from(overlay.querySelectorAll('button')).filter((button) => {
      const label = button.querySelector('[data-testid="button-label"]');
      return (label?.textContent || button.textContent).trim() === 'Activity';
    });
    activityButtons.forEach((button) => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        overlay.classList.remove('activity-closed');
        overlay.querySelector('[data-proto-activity-close]')?.focus();
      }, true);
    });
  };

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (!(node instanceof Element)) continue;
        if (node.matches('.project-reference-overlay')) enhanceProjectOverlay(node);
        node.querySelectorAll?.('.project-reference-overlay').forEach(enhanceProjectOverlay);
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  document.querySelectorAll('.project-reference-overlay').forEach(enhanceProjectOverlay);
})();
