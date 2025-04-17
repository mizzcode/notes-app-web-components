class NoteItem extends HTMLElement {
  constructor() {
    super();
    this._noteTitle = "";
    this._noteId = "";
    this._noteBody = "";
  }

  static get observedAttributes() {
    return ["note-title", "note-id", "note-body"];
  }

  connectedCallback() {
    this._noteId = this.getAttribute("note-id") || this.id;
    this.render();
    this.attachEventListeners();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      switch (name) {
        case "note-title":
          this._noteTitle = newValue;
          break;
        case "note-id":
          this._noteId = newValue;
          break;
        case "note-body":
          this._noteBody = newValue;
          break;
      }
      this.render();
    }
  }

  get noteTitle() {
    return this.getAttribute("note-title");
  }

  set noteTitle(value) {
    this.setAttribute("note-title", value);
  }

  get noteId() {
    return this.getAttribute("note-id");
  }

  set noteId(value) {
    this.setAttribute("note-id", value);
  }

  get noteBody() {
    return this.getAttribute("note-body");
  }

  set noteBody(value) {
    this.setAttribute("note-body", value);
  }

  render() {
    const title =
      this._noteTitle || this.getAttribute("note-title") || "Untitled Note";

    this.innerHTML = `
      <div class="bg-[#2b2c2e] p-4 rounded-lg cursor-pointer h-full flex items-center">
        <div class="w-full text-lg text-white mb-2">
          <h1>${title}</h1>
        </div>
        <div class="flex justify-end cursor-pointer">
          <button class="menu-btn">
            <img src="../src/images/more.png" class="w-6 h-6 cursor-pointer" alt="Menu" />
          </button>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    this.addEventListener("click", this.handleNoteClick.bind(this));

    const menuBtn = this.querySelector(".menu-btn");
    if (menuBtn) {
      menuBtn.addEventListener("click", this.handleMenuClick.bind(this));
    }
  }

  handleNoteClick(e) {
    if (e.target.closest(".menu-btn")) {
      return;
    }

    this.dispatchEvent(
      new CustomEvent("note-click", {
        bubbles: true,
        detail: { noteId: this._noteId || this.id },
      }),
    );
  }

  handleMenuClick(e) {
    e.stopPropagation();
    this.dispatchEvent(
      new CustomEvent("menu-click", {
        bubbles: true,
        detail: { noteId: this._noteId || this.id },
      }),
    );
  }
}

customElements.define("note-item", NoteItem);
