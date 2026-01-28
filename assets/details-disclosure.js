class DetailsDisclosure extends HTMLElement {
  constructor() {
    super();
    this.mainDetailsToggle = this.querySelector('details');
    this.content = this.mainDetailsToggle.querySelector('summary').nextElementSibling;

    this.mainDetailsToggle.addEventListener('focusout', this.onFocusOut.bind(this));
    this.mainDetailsToggle.addEventListener('toggle', this.onToggle.bind(this));
  }

  onFocusOut() {
    setTimeout(() => {
      if (!this.contains(document.activeElement)) this.close();
    });
  }

  onToggle() {
    if (!this.animations) this.animations = this.content.getAnimations();

    if (this.mainDetailsToggle.hasAttribute('open')) {
      this.animations.forEach((animation) => animation.play());
    } else {
      this.animations.forEach((animation) => animation.cancel());
    }
  }

  close() {
    this.mainDetailsToggle.removeAttribute('open');
    this.mainDetailsToggle.querySelector('summary').setAttribute('aria-expanded', 'false');
  }
}

customElements.define('details-disclosure', DetailsDisclosure);

class HeaderMenu extends DetailsDisclosure {
  constructor() {
    super();
    this.header = document.querySelector('.header-wrapper');
    this.isDesktop = window.matchMedia('(min-width: 990px)').matches;
    
    // Setup keyboard handlers (Escape key to close)
    this.setupKeyboardHandlers();
    
    // Setup outside click handler
    this.setupOutsideClickHandler();
    
    // Desktop: Open on hover/focus for better UX
    if (this.isDesktop) {
      this.setupDesktopHover();
    }
    
    // Listen for viewport changes
    window.matchMedia('(min-width: 990px)').addEventListener('change', (e) => {
      this.isDesktop = e.matches;
      if (this.isDesktop) {
        this.setupDesktopHover();
      } else {
        this.removeDesktopHover();
      }
    });
  }
  
  setupKeyboardHandlers() {
    // Handle Escape key to close menu
    this.handleKeyDown = (event) => {
      if (event.key === 'Escape' && this.mainDetailsToggle.hasAttribute('open')) {
        event.preventDefault();
        this.close();
        // Return focus to the summary element
        const summary = this.mainDetailsToggle.querySelector('summary');
        if (summary) summary.focus();
      }
    };
    
    this.addEventListener('keydown', this.handleKeyDown);
  }
  
  setupOutsideClickHandler() {
    // Handle clicks outside the menu to close it
    this.handleOutsideClick = (event) => {
      if (this.mainDetailsToggle.hasAttribute('open') && !this.contains(event.target)) {
        this.close();
      }
    };
    
    document.addEventListener('click', this.handleOutsideClick);
  }

  setupDesktopHover() {
    // Delay timers to prevent "jitter" on hover
    this.openDelay = null;
    this.closeDelay = null;
    
    this.handleMouseEnter = () => {
      clearTimeout(this.closeDelay);
      this.openDelay = setTimeout(() => {
        this.open();
      }, 50); // Small delay to prevent accidental opens
    };
    
    this.handleMouseLeave = () => {
      clearTimeout(this.openDelay);
      this.closeDelay = setTimeout(() => {
        this.close();
      }, 150); // Delay before closing to allow moving to submenu
    };
    
    // Keyboard: Open on focus for A11y
    this.handleFocusIn = () => {
      clearTimeout(this.closeDelay);
      this.open();
    };
    
    this.addEventListener('mouseenter', this.handleMouseEnter);
    this.addEventListener('mouseleave', this.handleMouseLeave);
    this.addEventListener('focusin', this.handleFocusIn);
  }
  
  removeDesktopHover() {
    if (this.handleMouseEnter) {
      this.removeEventListener('mouseenter', this.handleMouseEnter);
      this.removeEventListener('mouseleave', this.handleMouseLeave);
      this.removeEventListener('focusin', this.handleFocusIn);
    }
    clearTimeout(this.openDelay);
    clearTimeout(this.closeDelay);
  }
  
  disconnectedCallback() {
    // Cleanup event listeners
    if (this.handleKeyDown) {
      this.removeEventListener('keydown', this.handleKeyDown);
    }
    if (this.handleOutsideClick) {
      document.removeEventListener('click', this.handleOutsideClick);
    }
    this.removeDesktopHover();
  }

  open() {
    this.mainDetailsToggle.setAttribute('open', '');
    this.mainDetailsToggle.querySelector('summary').setAttribute('aria-expanded', 'true');
  }

  onToggle() {
    if (!this.header) return;
    this.header.preventHide = this.mainDetailsToggle.open;

    if (document.documentElement.style.getPropertyValue('--header-bottom-position-desktop') !== '') return;
    document.documentElement.style.setProperty(
      '--header-bottom-position-desktop',
      `${Math.floor(this.header.getBoundingClientRect().bottom)}px`
    );
  }
}

customElements.define('header-menu', HeaderMenu);
