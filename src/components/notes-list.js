// src/components/notes-list.js
import { notesData } from '../data/notes.js';

class NotesList extends HTMLElement {
  constructor() {
    super();
    const storedNotes = localStorage.getItem('notes');

    this.notes = storedNotes ? JSON.parse(storedNotes) : [];

    if (storedNotes === null) {
      localStorage.setItem('notes', JSON.stringify(notesData));
      this.notes = [...notesData];
    }

    this.currentView = 'notes';
  }

  connectedCallback() {
    this.render();

    // Listen for tab changes
    document.addEventListener('tab-changed', (e) => {
      this.currentView = e.detail.tab === 'notes' ? 'notes' : 'archieve';
      this.render();
    });

    // Listen for note created event
    document.addEventListener('note-created', (e) => {
      this.addNote(e.detail);
    });

    // Listen for note clicks
    this.addEventListener('note-click', (e) => {
      const noteId = e.detail.noteId;
      this.showNoteDetails(noteId);
    });

    // Listen for note updates
    document.addEventListener('note-updated', () => {
      // Reload notes from localStorage
      const storedNotes = localStorage.getItem('notes');
      this.notes = storedNotes ? JSON.parse(storedNotes) : [];
      this.render();
    });

    // Listen for menu clicks
    this.addEventListener('menu-click', (e) => {
      e.stopPropagation();
      const noteId = e.detail.noteId;
      this.showNoteOptions(noteId);
    });
  }

  showNoteOptions(noteId) {
    const note = this.notes.find(note => note.id === noteId);
    if (!note) return;

    if (confirm('Do you want to delete this note?')) {
      this.deleteNote(noteId);
    }
  }

  showNoteDetails(noteId) {
    // Get or create detail component
    let detailComponent = document.querySelector('note-detail');
    if (!detailComponent) {
      detailComponent = document.createElement('note-detail');
      document.body.appendChild(detailComponent);
    }

    // Use the direct method approach instead of attributes
    detailComponent.showNote(noteId);
  }

  toggleArchiveNote(noteId) {
    const noteIndex = this.notes.findIndex(note => note.id === noteId);
    if (noteIndex !== -1) {
      // Create a copy of the notes array
      const notesCopy = [...this.notes];
      notesCopy[noteIndex] = {
        ...notesCopy[noteIndex],
        archived: !notesCopy[noteIndex].archived
      };

      // Update the working data and localStorage
      this.notes = notesCopy;
      localStorage.setItem('notes', JSON.stringify(this.notes));
      this.render();
    }
  }

  deleteNote(noteId) {
    // Filter out the note to delete and create a new array
    this.notes = this.notes.filter(note => note.id !== noteId);
    localStorage.setItem('notes', JSON.stringify(this.notes));
    this.render();
  }

  addNote(noteData) {
    const newId = `notes-${Date.now()}`;
    const newNote = {
      id: newId,
      title: noteData.title,
      body: noteData.body,
      createdAt: new Date().toISOString(),
      archived: noteData.archived || false
    };

    // Add to the beginning of a new copy of the notes array
    this.notes = [newNote, ...this.notes];
    localStorage.setItem('notes', JSON.stringify(this.notes));
    this.render();
  }

  render() {
    // Filter notes based on current view
    const filteredNotes = this.notes.filter(note =>
      (this.currentView === 'notes' && !note.archived) ||
      (this.currentView === 'archieve' && note.archived)
    );

    // Create the notes list container using CSS Grid
    this.innerHTML = `
      <style>
        .notes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1rem;
          margin-top: 1.5rem;
        }
        
        @media (max-width: 640px) {
          .notes-grid {
            grid-template-columns: 1fr;
          }
        }
      </style>
      
      <div class="notes-grid">
        ${filteredNotes.length === 0 ?
        `<div class="text-center col-span-full mt-8 text-gray-400">No ${this.currentView} found</div>` :
        ''
      }
      </div>
    `;

    const container = this.querySelector('.notes-grid');

    // Add note elements to the container
    filteredNotes.forEach(note => {
      const noteElement = document.createElement('note-item');
      noteElement.setAttribute('title', note.title);
      noteElement.id = note.id;
      container.appendChild(noteElement);
    });
  }
}

customElements.define('notes-list', NotesList);