class NoteDetail extends HTMLElement {
  constructor() {
    super();
    // Initialize properties
    this._currentNoteId = null;
  }

  connectedCallback() {
    if (this.parentNode !== document.body) {
      document.body.appendChild(this);
    }
  }

  // Public method to display a note
  showNote(noteId) {
    console.log(`Showing note with ID: ${noteId}`);
    this._currentNoteId = noteId;
    this._loadAndRenderNote();

    // Make visible immediately
    this.style.position = 'fixed';
    this.style.inset = '0';
    this.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
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
      <style>
        .note-detail-overlay {
          position: fixed;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.75);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }
        
        .note-detail-card {
          background-color: #1f2937;
          border-radius: 0.5rem;
          width: 100%;
          max-width: 36rem;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
        }
        
        .note-header {
          padding: 1.5rem;
          border-bottom: 1px solid #374151;
        }
        
        .note-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
          margin-bottom: 0.5rem;
          line-height: 1.2;
        }
        
        .note-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 0.5rem;
        }
        
        .note-date {
          font-size: 0.875rem;
          color: #9ca3af;
        }
        
        .note-status {
          font-size: 0.875rem;
          padding: 0.25rem 0.5rem;
          border-radius: 9999px;
          background-color: #1f2937;
        }
        
        .status-archived {
          color: #fcd34d;
          border: 1px solid #fcd34d;
        }
        
        .status-active {
          color: #10b981;
          border: 1px solid #10b981;
        }
        
        .note-body {
          padding: 1.5rem;
          background-color: #111827;
          flex: 1;
          min-height: 12rem;
          color: #e5e7eb;
          line-height: 1.5;
          overflow-y: auto;
          border-radius: 0.375rem;
          margin: 0 1.5rem;
        }
        
        .note-actions {
          padding: 1.5rem;
          display: flex;
          justify-content: space-between;
          border-top: 1px solid #374151;
        }
        
        .action-button {
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .archive-button {
          background-color: #2563eb;
          color: white;
        }
        
        .archive-button:hover {
          background-color: #1d4ed8;
        }
        
        .close-button {
          background-color: #4b5563;
          color: white;
        }
        
        .close-button:hover {
          background-color: #374151;
        }
      </style>
      
      <div class="note-detail-overlay">
        <div class="note-detail-card">
          <div class="note-header">
            <h2 class="note-title">${note.title}</h2>
            <div class="note-meta">
              <span class="note-date">Created: ${createdDate}</span>
              <span class="note-status ${note.archived ? 'status-archived' : 'status-active'}">
                ${note.archived ? 'Archived' : 'Active'}
              </span>
            </div>
          </div>
          
          <div class="note-body">
            ${note.body || 'No content'}
          </div>
          
          <div class="note-actions">
            <button id="archive-button" class="action-button archive-button">
              ${note.archived ? 'Unarchive' : 'Archive'}
            </button>
            <button id="close-detail" class="action-button close-button">
              Close
            </button>
          </div>
        </div>
      </div>
    `;

    // Add event listeners
    this.querySelector('#close-detail').addEventListener('click', () => this.close());
    this.querySelector('#archive-button').addEventListener('click', () => this._toggleArchiveStatus(note));

    // Click outside to close
    this.querySelector('.note-detail-overlay').addEventListener('click', (e) => {
      if (e.target === this.querySelector('.note-detail-overlay')) {
        this.close();
      }
    });
  }

  // Toggle archive status
  _toggleArchiveStatus(note) {
    try {
      const notes = JSON.parse(localStorage.getItem('notes') || '[]');
      const noteIndex = notes.findIndex(n => n.id === this._currentNoteId);

      if (noteIndex !== -1) {
        notes[noteIndex].archived = !notes[noteIndex].archived;
        localStorage.setItem('notes', JSON.stringify(notes));

        // Dispatch event to update UI
        this.dispatchEvent(new CustomEvent('note-updated', {
          bubbles: true
        }));
      }
    } catch (err) {
      console.error('Error toggling archive status:', err);
    }

    this.close();
  }

  // Render not found message
  _renderNotFound() {
    this.innerHTML = `
      <style>
        .note-detail-overlay {
          position: fixed;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.75);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }
        
        .not-found-card {
          background-color: #1f2937;
          border-radius: 0.5rem;
          width: 100%;
          max-width: 28rem;
          padding: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          text-align: center;
        }
        
        .not-found-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: white;
          margin-bottom: 1rem;
        }
        
        .not-found-message {
          color: #9ca3af;
          margin-bottom: 1.5rem;
        }
        
        .close-button {
          padding: 0.5rem 1.5rem;
          background-color: #ef4444;
          color: white;
          border-radius: 0.375rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
          display: inline-block;
        }
        
        .close-button:hover {
          background-color: #dc2626;
        }
      </style>
      
      <div class="note-detail-overlay">
        <div class="not-found-card">
          <h2 class="not-found-title">Note not found</h2>
          <p class="not-found-message">The note you're looking for could not be found.</p>
          <button id="close-detail" class="close-button">Close</button>
        </div>
      </div>
    `;

    const closeButton = this.querySelector('#close-detail');
    if (closeButton) {
      closeButton.addEventListener('click', () => this.close());
    }

    // Click outside to close
    this.querySelector('.note-detail-overlay').addEventListener('click', (e) => {
      if (e.target === this.querySelector('.note-detail-overlay')) {
        this.close();
      }
    });
  }

  // Render error message
  _renderError(message) {
    this.innerHTML = `
      <style>
        .note-detail-overlay {
          position: fixed;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.75);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }
        
        .error-card {
          background-color: #1f2937;
          border-radius: 0.5rem;
          width: 100%;
          max-width: 28rem;
          padding: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .error-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: white;
          margin-bottom: 1rem;
        }
        
        .error-message {
          color: #ef4444;
          margin-bottom: 1.5rem;
          padding: 0.75rem;
          background-color: rgba(239, 68, 68, 0.1);
          border-radius: 0.375rem;
        }
        
        .close-button {
          padding: 0.5rem 1.5rem;
          background-color: #ef4444;
          color: white;
          border-radius: 0.375rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
          display: inline-block;
        }
        
        .close-button:hover {
          background-color: #dc2626;
        }
      </style>
      
      <div class="note-detail-overlay">
        <div class="error-card">
          <h2 class="error-title">Error Loading Note</h2>
          <p class="error-message">${message}</p>
          <button id="close-detail" class="close-button">Close</button>
        </div>
      </div>
    `;

    const closeButton = this.querySelector('#close-detail');
    if (closeButton) {
      closeButton.addEventListener('click', () => this.close());
    }

    // Click outside to close
    this.querySelector('.note-detail-overlay').addEventListener('click', (e) => {
      if (e.target === this.querySelector('.note-detail-overlay')) {
        this.close();
      }
    });
  }

  // Close the detail view
  close() {
    this.style.display = 'none';
  }
}

customElements.define('note-detail', NoteDetail);