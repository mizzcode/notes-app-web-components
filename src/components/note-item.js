class NoteItem extends HTMLElement {
  constructor() {
    super();
    this._title = '';
    this._id = '';
  }

  static get observedAttributes() {
    return ['title', 'id'];
  }

  connectedCallback() {
    this._id = this.id; // Store the ID when connected
    this.render();
    this.attachEventListeners();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      // Store the value in a private property
      this[`_${name}`] = newValue;
      // Render konten ulang
      this.render();

      // Reattach event listeners after rendering
      if (this.isConnected) {
        this.attachEventListeners();
      }
    }
  }

  render() {
    const title = this._title || this.getAttribute('title') || 'Untitled Note';

    this.innerHTML = `
      <div class="bg-[#2b2c2e] p-4 rounded-lg cursor-pointer h-full flex items-center">
        <div class="w-full text-lg text-white">
          <h1>${title}</h1>
        </div>
        <div class="flex justify-end cursor-pointer">
          <button class="menu-btn">
            <img src="./src/images/more.png" class="w-6 h-6 cursor-pointer" alt="Menu" />
          </button>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    // Directly attach the click handler to the entire component
    this.addEventListener('click', this.handleNoteClick.bind(this));

    // Add menu button click handler
    const menuBtn = this.querySelector('.menu-btn');
    if (menuBtn) {
      menuBtn.addEventListener('click', this.handleMenuClick.bind(this));
    }
  }

  handleNoteClick(e) {
    // Don't trigger if the menu button was clicked
    if (e.target.closest('.menu-btn')) {
      return;
    }

    this.dispatchEvent(new CustomEvent('note-click', {
      bubbles: true,
      detail: { noteId: this._id || this.id }
    }));
  }

  handleMenuClick(e) {
    e.stopPropagation(); // Prevent the note click handler from firing
    this.dispatchEvent(new CustomEvent('menu-click', {
      bubbles: true,
      detail: { noteId: this._id || this.id }
    }));
  }
}

customElements.define('note-item', NoteItem);