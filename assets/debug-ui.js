/**
 * =============================================================================
 * DEBUG UI JAVASCRIPT
 * Version: 1.0.0
 * =============================================================================
 * 
 * Activated via ?debug_ui=1 URL parameter
 * 
 * Features:
 * - Displays computed CSS custom property values
 * - Outlines sticky/fixed positioned elements
 * - Keyboard shortcuts for additional debugging
 * 
 * NOTE: This script only runs when debug mode is active.
 *       It has NO impact on production UI when disabled.
 * =============================================================================
 */

(function() {
  'use strict';

  // Check if debug mode is enabled via URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const debugMode = urlParams.get('debug_ui') === '1';

  if (!debugMode) {
    return; // Exit early if debug mode is not enabled
  }

  // Add debug attribute to document for CSS targeting
  document.documentElement.setAttribute('data-debug-ui', 'true');

  /**
   * Get computed CSS custom property value
   * @param {string} property - CSS custom property name (e.g., '--tech-topbar-h')
   * @returns {string} - Computed value or 'undefined'
   */
  function getCSSVar(property) {
    const value = getComputedStyle(document.documentElement).getPropertyValue(property).trim();
    return value || 'undefined';
  }

  /**
   * Create and inject the debug panel
   */
  function createDebugPanel() {
    // Get CSS variable values
    const topbarH = getCSSVar('--tech-topbar-h');
    const headerH = getCSSVar('--tech-header-h');
    const stackH = getCSSVar('--tech-stack-h');
    
    // Get TA token values as well
    const taTopbar = getCSSVar('--ta-height-topbar');
    const taHeader = getCSSVar('--ta-height-header');
    const taStack = getCSSVar('--ta-height-stack');

    // Get viewport info
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const isMobile = viewportWidth < 750;

    // Count fixed/sticky elements using targeted selectors (performance optimized)
    // Instead of querying all elements, target known containers and common sticky/fixed patterns
    const targetedSelectors = [
      'header', '.header', '.header-wrapper',
      '.announcement-bar', '.announcement',
      '.sticky', '[class*="sticky"]',
      '.fixed', '[class*="fixed"]',
      '.cart-drawer', '.cart-notification',
      '.modal', '.drawer',
      '.whatsapp-float', '.cookie-banner',
      'nav', '.nav', '.navigation',
      '[style*="position"]'
    ].join(',');
    
    const targetedElements = document.querySelectorAll(targetedSelectors);
    let stickyCount = 0;
    let fixedCount = 0;

    targetedElements.forEach(el => {
      const style = window.getComputedStyle(el);
      if (style.position === 'sticky') stickyCount++;
      if (style.position === 'fixed') fixedCount++;
    });

    // Create panel HTML
    const panel = document.createElement('div');
    panel.className = 'debug-ui-panel';
    panel.innerHTML = `
      <div class="debug-ui-panel__header">
        <span class="debug-ui-panel__title">🔧 DEBUG UI</span>
        <button class="debug-ui-panel__close" onclick="this.closest('.debug-ui-panel').remove()">×</button>
      </div>
      
      <div class="debug-ui-panel__section">
        <div class="debug-ui-panel__section-title">Layout Heights (Legacy)</div>
        <div class="debug-ui-panel__row">
          <span class="debug-ui-panel__label">--tech-topbar-h:</span>
          <span class="debug-ui-panel__value">${topbarH}</span>
        </div>
        <div class="debug-ui-panel__row">
          <span class="debug-ui-panel__label">--tech-header-h:</span>
          <span class="debug-ui-panel__value">${headerH}</span>
        </div>
        <div class="debug-ui-panel__row">
          <span class="debug-ui-panel__label">--tech-stack-h:</span>
          <span class="debug-ui-panel__value">${stackH}</span>
        </div>
      </div>
      
      <div class="debug-ui-panel__section">
        <div class="debug-ui-panel__section-title">Layout Heights (TA Tokens)</div>
        <div class="debug-ui-panel__row">
          <span class="debug-ui-panel__label">--ta-height-topbar:</span>
          <span class="debug-ui-panel__value">${taTopbar}</span>
        </div>
        <div class="debug-ui-panel__row">
          <span class="debug-ui-panel__label">--ta-height-header:</span>
          <span class="debug-ui-panel__value">${taHeader}</span>
        </div>
        <div class="debug-ui-panel__row">
          <span class="debug-ui-panel__label">--ta-height-stack:</span>
          <span class="debug-ui-panel__value">${taStack}</span>
        </div>
      </div>
      
      <div class="debug-ui-panel__section">
        <div class="debug-ui-panel__section-title">Viewport</div>
        <div class="debug-ui-panel__row">
          <span class="debug-ui-panel__label">Size:</span>
          <span class="debug-ui-panel__value">${viewportWidth} × ${viewportHeight}px</span>
        </div>
        <div class="debug-ui-panel__row">
          <span class="debug-ui-panel__label">Mode:</span>
          <span class="debug-ui-panel__value ${isMobile ? 'debug-ui-panel__value--warning' : ''}">${isMobile ? 'Mobile' : 'Desktop'}</span>
        </div>
      </div>
      
      <div class="debug-ui-panel__section">
        <div class="debug-ui-panel__section-title">Position Elements</div>
        <div class="debug-ui-panel__row">
          <span class="debug-ui-panel__label">Sticky elements:</span>
          <span class="debug-ui-panel__value">${stickyCount}</span>
        </div>
        <div class="debug-ui-panel__row">
          <span class="debug-ui-panel__label">Fixed elements:</span>
          <span class="debug-ui-panel__value">${fixedCount}</span>
        </div>
      </div>
      
      <div class="debug-ui-panel__info">
        <strong>Outlines:</strong><br>
        <span style="color:#00ff00">● Green dashed</span> = sticky<br>
        <span style="color:#ff00ff">● Magenta dashed</span> = fixed<br>
        <span style="color:#00ffff">● Cyan solid</span> = known UI elements
      </div>
    `;

    document.body.appendChild(panel);
  }

  /**
   * Create keyboard shortcuts panel
   */
  function createShortcutsPanel() {
    const shortcuts = document.createElement('div');
    shortcuts.className = 'debug-ui-shortcuts';
    shortcuts.innerHTML = `
      <div class="debug-ui-shortcuts__title">Shortcuts</div>
      <div class="debug-ui-shortcuts__item">
        <span class="debug-ui-shortcuts__key">G</span>
        <span>Toggle grid overlay</span>
      </div>
      <div class="debug-ui-shortcuts__item">
        <span class="debug-ui-shortcuts__key">R</span>
        <span>Refresh values</span>
      </div>
      <div class="debug-ui-shortcuts__item">
        <span class="debug-ui-shortcuts__key">Esc</span>
        <span>Close panel</span>
      </div>
    `;

    document.body.appendChild(shortcuts);
  }

  /**
   * Set up keyboard shortcuts
   */
  function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
      // Ignore if user is typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'g':
          // Toggle grid overlay
          document.documentElement.toggleAttribute('data-debug-grid');
          break;
        case 'r':
          // Refresh debug panel values
          const existingPanel = document.querySelector('.debug-ui-panel');
          if (existingPanel) {
            existingPanel.remove();
          }
          createDebugPanel();
          break;
        case 'escape':
          // Close debug panel
          const panel = document.querySelector('.debug-ui-panel');
          if (panel) {
            panel.remove();
          }
          break;
      }
    });
  }

  /**
   * Update panel on resize
   */
  function setupResizeHandler() {
    let resizeTimeout;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(function() {
        const existingPanel = document.querySelector('.debug-ui-panel');
        if (existingPanel) {
          existingPanel.remove();
          createDebugPanel();
        }
      }, 250);
    });
  }

  /**
   * Log debug info to console
   */
  function logDebugInfo() {
    console.group('%c🔧 DEBUG UI ACTIVE', 'color: #00ff00; font-weight: bold; font-size: 14px;');
    console.log('%cLayout CSS Variables:', 'color: #00ffff; font-weight: bold;');
    console.table({
      '--tech-topbar-h': getCSSVar('--tech-topbar-h'),
      '--tech-header-h': getCSSVar('--tech-header-h'),
      '--tech-stack-h': getCSSVar('--tech-stack-h'),
      '--ta-height-topbar': getCSSVar('--ta-height-topbar'),
      '--ta-height-header': getCSSVar('--ta-height-header'),
      '--ta-height-stack': getCSSVar('--ta-height-stack'),
    });
    console.log('%cViewport:', 'color: #00ffff; font-weight: bold;', `${window.innerWidth} × ${window.innerHeight}px`);
    console.log('%cTo disable debug mode, remove ?debug_ui=1 from the URL', 'color: #888;');
    console.groupEnd();
  }

  /**
   * Initialize debug mode
   */
  function init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initDebug);
    } else {
      initDebug();
    }
  }

  function initDebug() {
    createDebugPanel();
    createShortcutsPanel();
    setupKeyboardShortcuts();
    setupResizeHandler();
    logDebugInfo();
  }

  // Start initialization
  init();
})();
