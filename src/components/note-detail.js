class NoteDetail extends HTMLElement {
  constructor() {
    super();
    // Initialize properties
    this._currentNoteId = null;
    this._currentNote = null;
  }

  connectedCallback() {
    // Add to body to ensure it's visible
    if (this.parentNode !== document.body) {
      document.body.appendChild(this);
    }
  }

  // Public method to display a note
  showNote(noteId) {
    this._currentNoteId = noteId;
    this._loadAndRenderNote();

    // Make visible immediately
    this.style.position = 'fixed';
    this.style.inset = '0';
    this.style.backgroundColor = 'rgba(0, 0, 0, 0.75)';
    this.style.display = 'flex';
    this.style.alignItems = 'center';
    this.style.justifyContent = 'center';
    this.style.zIndex = '1000';
  }

  // Private method to load and render note data
  _loadAndRenderNote() {
    try {
      // Get note data from localStorage
      const notes = JSON.parse(localStorage.getItem('notes') || '[]');
      const note = notes.find(n => n.id === this._currentNoteId);

      if (note) {
        this._currentNote = note;
        this._renderNote(note);
      } else {
        this._renderNotFound();
      }
    } catch (err) {
      console.error('Error loading note:', err);
      this._renderError(err.message);
    }
  }

  // Render a found note
  _renderNote(note) {
    // Format date
    const createdDate = new Date(note.createdAt).toLocaleString();

    this.innerHTML = `
      <div class="note-detail-content bg-[#202224] p-6 rounded-lg w-full max-w-2xl mx-4 border border-[#35383c]">
        <h2 class="text-2xl font-bold mb-2">${note.title}</h2>
        <p class="text-gray-400 text-sm mb-4">Created: ${createdDate}</p>
        
        <div class="bg-[#2b2c2e] p-4 rounded-lg mb-6 min-h-32 whitespace-pre-wrap">
          ${note.body}
        </div>
        
        <div class="mb-6">
          <label class="flex items-center cursor-pointer mt-5">
            <input type="checkbox" id="archive-checkbox" class="mr-2" ${note.archived ? 'checked' : ''}>
            <span>Archive this note</span>
          </label>
        </div>
        
        <div class="flex justify-end items-center space-x-5">
          <button id="cancel-button" class="cursor-pointer px-4 py-2 rounded-full bg-[#2b2c2e] border border-[#35383c] hover:bg-[#35383c] transition-colors">
            Cancel
          </button>
          <button id="save-button" class="cursor-pointer px-4 py-2 rounded-full bg-[#2b2c2e] border border-red-500 hover:bg-red-500/10 transition-colors">
            Save
          </button>
        </div>
      </div>
    `;

    // Add event listeners
    this.querySelector('#cancel-button').addEventListener('click', () => this.close());
    this.querySelector('#save-button').addEventListener('click', () => this._saveChanges());

    // Click outside to close
    this.addEventListener('click', (e) => {
      if (e.target === this) {
        this.close();
      }
    });
  }

  // Save changes to the note
  _saveChanges() {
    if (!this._currentNote) return;

    // Get archive checkbox value
    const isArchived = this.querySelector('#archive-checkbox').checked;

    // Update archive status if it changed
    if (this._currentNote.archived !== isArchived) {
      this._currentNote.archived = isArchived;

      // Save to localStorage
      try {
        const notes = JSON.parse(localStorage.getItem('notes') || '[]');
        const noteIndex = notes.findIndex(n => n.id === this._currentNoteId);

        if (noteIndex !== -1) {
          notes[noteIndex].archived = isArchived;
          localStorage.setItem('notes', JSON.stringify(notes));

          // Dispatch event to update UI
          this.dispatchEvent(new CustomEvent('note-updated', {
            bubbles: true,
            detail: {
              noteId: this._currentNoteId,
              note: this._currentNote
            }
          }));
        }
      } catch (err) {
        console.error('Error saving note:', err);
      }
    }

    this.close();
  }

  // Render not found message
  _renderNotFound() {
    this.innerHTML = `
      <div class="note-detail-content bg-[#202224] p-6 rounded-lg w-full max-w-md mx-4 border border-[#35383c]">
        <h2 class="text-xl font-bold mb-4">Note not found</h2>
        <p class="mb-4">The note you're looking for could not be found.</p>
        <button id="close-detail" class="px-4 py-2 bg-[#2b2c2e] rounded-full border border-[#35383c] hover:bg-[#35383c]">
          Close
        </button>
      </div>
    `;

    const closeButton = this.querySelector('#close-detail');
    if (closeButton) {
      closeButton.addEventListener('click', () => this.close());
    }
  }

  // Render error message
  _renderError(message) {
    this.innerHTML = `
      <div class="note-detail-content bg-[#202224] p-6 rounded-lg w-full max-w-md mx-4 border border-[#35383c]">
        <h2 class="text-xl font-bold mb-4">Error Loading Note</h2>
        <p class="text-red-400 mb-4">${message}</p>
        <button id="close-detail" class="px-4 py-2 bg-[#2b2c2e] rounded-full border border-[#35383c] hover:bg-[#35383c]">
          Close
        </button>
      </div>
    `;

    const closeButton = this.querySelector('#close-detail');
    if (closeButton) {
      closeButton.addEventListener('click', () => this.close());
    }
  }

  // Close the detail view
  close() {
    this.style.display = 'none';
  }
}

customElements.define('note-detail', NoteDetail);