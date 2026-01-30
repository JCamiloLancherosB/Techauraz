class PredictiveSearch extends SearchForm {
  constructor() {
    super();
    this.cachedResults = {};
    this.predictiveSearchResults = this.querySelector('[data-predictive-search]');
    this.allPredictiveSearchInstances = document.querySelectorAll('predictive-search');
    this.isOpen = false;
    this.abortController = new AbortController();
    this.searchTerm = '';
    
    // Recent searches configuration
    this.recentSearchesKey = 'techauraz_recent_searches';
    this.maxRecentSearches = 5;
    this.recentSearchesContainer = null;

    this.setupEventListeners();
    this.initRecentSearches();
  }

  setupEventListeners() {
    this.input.form.addEventListener('submit', this.onFormSubmit.bind(this));

    this.input.addEventListener('focus', this.onFocus.bind(this));
    this.addEventListener('focusout', this.onFocusOut.bind(this));
    this.addEventListener('keyup', this.onKeyup.bind(this));
    this.addEventListener('keydown', this.onKeydown.bind(this));
  }

  // ============================================================================
  // RECENT SEARCHES FUNCTIONALITY
  // ============================================================================
  
  initRecentSearches() {
    this.recentSearchesContainer = this.querySelector('[data-recent-searches]');
  }

  getRecentSearches() {
    try {
      const searches = localStorage.getItem(this.recentSearchesKey);
      return searches ? JSON.parse(searches) : [];
    } catch (e) {
      return [];
    }
  }

  saveRecentSearch(term) {
    if (!term || term.length < 2) return;
    
    try {
      let searches = this.getRecentSearches();
      // Remove if already exists (will re-add at top)
      searches = searches.filter(s => s.toLowerCase() !== term.toLowerCase());
      // Add to beginning
      searches.unshift(term);
      // Keep only max items
      searches = searches.slice(0, this.maxRecentSearches);
      localStorage.setItem(this.recentSearchesKey, JSON.stringify(searches));
      
      // Sync across all instances
      this.allPredictiveSearchInstances.forEach(instance => {
        instance.renderRecentSearches();
      });
    } catch (e) {
      // localStorage not available
    }
  }

  removeRecentSearch(term) {
    try {
      let searches = this.getRecentSearches();
      searches = searches.filter(s => s !== term);
      localStorage.setItem(this.recentSearchesKey, JSON.stringify(searches));
      
      // Sync across all instances
      this.allPredictiveSearchInstances.forEach(instance => {
        instance.renderRecentSearches();
      });
    } catch (e) {
      // localStorage not available
    }
  }

  clearRecentSearches() {
    try {
      localStorage.removeItem(this.recentSearchesKey);
      this.allPredictiveSearchInstances.forEach(instance => {
        instance.renderRecentSearches();
      });
    } catch (e) {
      // localStorage not available
    }
  }

  renderRecentSearches() {
    const container = this.recentSearchesContainer;
    if (!container) return;

    const searches = this.getRecentSearches();
    const listElement = container.querySelector('[data-recent-searches-list]');
    
    if (!listElement) return;

    if (searches.length === 0) {
      container.style.display = 'none';
      return;
    }

    container.style.display = 'block';
    listElement.innerHTML = searches.map(term => `
      <button type="button" class="predictive-search__recent-item" data-recent-search-term="${this.escapeHtml(term)}">
        <svg class="predictive-search__recent-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        <span>${this.escapeHtml(term)}</span>
        <svg class="predictive-search__recent-remove" data-remove-recent="${this.escapeHtml(term)}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    `).join('');

    // Add click handlers
    listElement.querySelectorAll('[data-recent-search-term]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        // Check if clicking remove button
        if (e.target.closest('[data-remove-recent]')) {
          e.stopPropagation();
          const termToRemove = e.target.closest('[data-remove-recent]').dataset.removeRecent;
          this.removeRecentSearch(termToRemove);
          return;
        }
        const term = btn.dataset.recentSearchTerm;
        this.input.value = term;
        this.searchTerm = term;
        this.onChange();
      });
    });

    // Clear all button handler
    const clearBtn = container.querySelector('[data-clear-recent-searches]');
    if (clearBtn) {
      clearBtn.onclick = () => this.clearRecentSearches();
    }
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ============================================================================
  // ANALYTICS TRACKING
  // ============================================================================
  
  trackSearchEvent(searchTerm, resultsCount = 0) {
    // Track via dataLayer for Google Analytics / GTM
    if (typeof window.dataLayer !== 'undefined') {
      window.dataLayer.push({
        event: 'search',
        search_term: searchTerm,
        search_results_count: resultsCount
      });
    }

    // Track via Shopify's analytics if available
    if (typeof window.ShopifyAnalytics !== 'undefined' && window.ShopifyAnalytics.lib) {
      try {
        window.ShopifyAnalytics.lib.track('Search', {
          query: searchTerm,
          resultsCount: resultsCount
        });
      } catch (e) {
        // Shopify analytics not available
      }
    }

    // Custom event for other tracking integrations
    document.dispatchEvent(new CustomEvent('predictive-search:query', {
      detail: { term: searchTerm, resultsCount: resultsCount }
    }));
  }

  trackSearchSelection(searchTerm, selectedItem, itemType) {
    if (typeof window.dataLayer !== 'undefined') {
      window.dataLayer.push({
        event: 'search_result_click',
        search_term: searchTerm,
        selected_item: selectedItem,
        item_type: itemType
      });
    }

    document.dispatchEvent(new CustomEvent('predictive-search:select', {
      detail: { term: searchTerm, item: selectedItem, type: itemType }
    }));
  }

  getQuery() {
    return this.input.value.trim();
  }

  onChange() {
    super.onChange();
    const newSearchTerm = this.getQuery();
    if (!this.searchTerm || !newSearchTerm.startsWith(this.searchTerm)) {
      // Remove the results when they are no longer relevant for the new search term
      // so they don't show up when the dropdown opens again
      this.querySelector('#predictive-search-results-groups-wrapper')?.remove();
    }

    // Update the term asap, don't wait for the predictive search query to finish loading
    this.updateSearchForTerm(this.searchTerm, newSearchTerm);

    this.searchTerm = newSearchTerm;

    if (!this.searchTerm.length) {
      this.close(true);
      return;
    }

    this.getSearchResults(this.searchTerm);
  }

  onFormSubmit(event) {
    const query = this.getQuery();
    if (!query.length || this.querySelector('[aria-selected="true"] a')) {
      event.preventDefault();
      return;
    }
    
    // Save to recent searches and track before submitting
    this.saveRecentSearch(query);
    this.trackSearchEvent(query);
  }

  onFormReset(event) {
    super.onFormReset(event);
    if (super.shouldResetForm()) {
      this.searchTerm = '';
      this.abortController.abort();
      this.abortController = new AbortController();
      this.closeResults(true);
    }
  }

  onFocus() {
    const currentSearchTerm = this.getQuery();

    // Show recent searches when input is empty
    if (!currentSearchTerm.length) {
      this.renderRecentSearches();
      const hasRecentSearches = this.getRecentSearches().length > 0;
      if (hasRecentSearches && this.recentSearchesContainer) {
        this.open();
      }
      return;
    }

    if (this.searchTerm !== currentSearchTerm) {
      // Search term was changed from other search input, treat it as a user change
      this.onChange();
    } else if (this.getAttribute('results') === 'true') {
      this.open();
    } else {
      this.getSearchResults(this.searchTerm);
    }
  }

  onFocusOut() {
    setTimeout(() => {
      if (!this.contains(document.activeElement)) this.close();
    });
  }

  onKeyup(event) {
    if (!this.getQuery().length) this.close(true);
    event.preventDefault();

    switch (event.code) {
      case 'ArrowUp':
        this.switchOption('up');
        break;
      case 'ArrowDown':
        this.switchOption('down');
        break;
      case 'Enter':
        this.selectOption();
        break;
      case 'Escape':
        this.close();
        this.input.blur();
        break;
    }
  }

  onKeydown(event) {
    // Prevent the cursor from moving in the input when using the up and down arrow keys
    if (event.code === 'ArrowUp' || event.code === 'ArrowDown') {
      event.preventDefault();
    }
    // Prevent form submission on Escape
    if (event.code === 'Escape') {
      event.preventDefault();
    }
  }

  updateSearchForTerm(previousTerm, newTerm) {
    const searchForTextElement = this.querySelector('[data-predictive-search-search-for-text]');
    const currentButtonText = searchForTextElement?.innerText;
    if (currentButtonText) {
      if (currentButtonText.match(new RegExp(previousTerm, 'g')).length > 1) {
        // The new term matches part of the button text and not just the search term, do not replace to avoid mistakes
        return;
      }
      const newButtonText = currentButtonText.replace(previousTerm, newTerm);
      searchForTextElement.innerText = newButtonText;
    }
  }

  switchOption(direction) {
    if (!this.getAttribute('open')) return;

    const moveUp = direction === 'up';
    const selectedElement = this.querySelector('[aria-selected="true"]');

    // Filter out hidden elements (duplicated page and article resources) thanks
    // to this https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent
    const allVisibleElements = Array.from(this.querySelectorAll('li, button.predictive-search__item')).filter(
      (element) => element.offsetParent !== null
    );
    let activeElementIndex = 0;

    if (moveUp && !selectedElement) return;

    let selectedElementIndex = -1;
    let i = 0;

    while (selectedElementIndex === -1 && i <= allVisibleElements.length) {
      if (allVisibleElements[i] === selectedElement) {
        selectedElementIndex = i;
      }
      i++;
    }

    this.statusElement.textContent = '';

    if (!moveUp && selectedElement) {
      activeElementIndex = selectedElementIndex === allVisibleElements.length - 1 ? 0 : selectedElementIndex + 1;
    } else if (moveUp) {
      activeElementIndex = selectedElementIndex === 0 ? allVisibleElements.length - 1 : selectedElementIndex - 1;
    }

    if (activeElementIndex === selectedElementIndex) return;

    const activeElement = allVisibleElements[activeElementIndex];

    activeElement.setAttribute('aria-selected', true);
    if (selectedElement) selectedElement.setAttribute('aria-selected', false);

    this.input.setAttribute('aria-activedescendant', activeElement.id);
  }

  selectOption() {
    const selectedOption = this.querySelector('[aria-selected="true"] a, button[aria-selected="true"]');

    if (selectedOption) {
      // Track the selection
      const searchTerm = this.getQuery();
      const selectedItem = selectedOption.href || selectedOption.textContent;
      const itemType = this.getSelectedItemType(selectedOption);
      
      // Save search term to recent searches
      if (searchTerm) {
        this.saveRecentSearch(searchTerm);
      }
      
      this.trackSearchSelection(searchTerm, selectedItem, itemType);
      selectedOption.click();
    }
  }

  getSelectedItemType(element) {
    const parentLi = element.closest('li');
    if (!parentLi) return 'search-all';
    
    const id = parentLi.id || '';
    if (id.includes('product')) return 'product';
    if (id.includes('collection')) return 'collection';
    if (id.includes('query')) return 'suggestion';
    if (id.includes('page')) return 'page';
    if (id.includes('article')) return 'article';
    return 'other';
  }

  getSearchResults(searchTerm) {
    const queryKey = searchTerm.replace(' ', '-').toLowerCase();
    this.setLiveRegionLoadingState();
    
    // Cancel any pending requests
    this.abortController.abort();
    this.abortController = new AbortController();

    if (this.cachedResults[queryKey]) {
      this.renderSearchResults(this.cachedResults[queryKey]);
      return;
    }

    fetch(`${routes.predictive_search_url}?q=${encodeURIComponent(searchTerm)}&section_id=predictive-search`, {
      signal: this.abortController.signal,
    })
      .then((response) => {
        if (!response.ok) {
          var error = new Error(response.status);
          this.close();
          throw error;
        }

        return response.text();
      })
      .then((text) => {
        const resultsMarkup = new DOMParser()
          .parseFromString(text, 'text/html')
          .querySelector('#shopify-section-predictive-search').innerHTML;
        // Save bandwidth keeping the cache in all instances synced
        this.allPredictiveSearchInstances.forEach((predictiveSearchInstance) => {
          predictiveSearchInstance.cachedResults[queryKey] = resultsMarkup;
        });
        this.renderSearchResults(resultsMarkup);
      })
      .catch((error) => {
        if (error?.code === 20) {
          // Code 20 means the call was aborted
          return;
        }
        this.close();
        throw error;
      });
  }

  setLiveRegionLoadingState() {
    this.statusElement = this.statusElement || this.querySelector('.predictive-search-status');
    this.loadingText = this.loadingText || this.getAttribute('data-loading-text');

    this.setLiveRegionText(this.loadingText);
    this.setAttribute('loading', true);
  }

  setLiveRegionText(statusText) {
    this.statusElement.setAttribute('aria-hidden', 'false');
    this.statusElement.textContent = statusText;

    setTimeout(() => {
      this.statusElement.setAttribute('aria-hidden', 'true');
    }, 1000);
  }

  renderSearchResults(resultsMarkup) {
    this.predictiveSearchResults.innerHTML = resultsMarkup;
    this.setAttribute('results', true);

    this.setLiveRegionResults();
    this.open();
  }

  setLiveRegionResults() {
    this.removeAttribute('loading');
    this.setLiveRegionText(this.querySelector('[data-predictive-search-live-region-count-value]').textContent);
  }

  getResultsMaxHeight() {
    this.resultsMaxHeight =
      window.innerHeight - document.querySelector('.section-header').getBoundingClientRect().bottom;
    return this.resultsMaxHeight;
  }

  open() {
    this.predictiveSearchResults.style.maxHeight = this.resultsMaxHeight || `${this.getResultsMaxHeight()}px`;
    this.setAttribute('open', true);
    this.input.setAttribute('aria-expanded', true);
    this.isOpen = true;
  }

  close(clearSearchTerm = false) {
    this.closeResults(clearSearchTerm);
    this.isOpen = false;
  }

  closeResults(clearSearchTerm = false) {
    if (clearSearchTerm) {
      this.input.value = '';
      this.removeAttribute('results');
    }
    const selected = this.querySelector('[aria-selected="true"]');

    if (selected) selected.setAttribute('aria-selected', false);

    this.input.setAttribute('aria-activedescendant', '');
    this.removeAttribute('loading');
    this.removeAttribute('open');
    this.input.setAttribute('aria-expanded', false);
    this.resultsMaxHeight = false;
    this.predictiveSearchResults.removeAttribute('style');
  }
}

customElements.define('predictive-search', PredictiveSearch);
