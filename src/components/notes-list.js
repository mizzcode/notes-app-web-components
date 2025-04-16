import NotesService from "../data/api/notes.js";
import { animate, createSpring } from "animejs";

class NotesList extends HTMLElement {
  constructor() {
    super();
    this.notes = [];
    this.spinner = null;
    this.currentView = "notes";
  }

  async connectedCallback() {
    const loadingSpinner = document.createElement("loading-spinner");

    animate("#img-kamado", {
      scale: [
        { to: 1.25, ease: "inOut(3)", duration: 200 },
        { to: 1, ease: createSpring({ stiffness: 300 }) },
      ],
      loop: true,
      loopDelay: 250,
    });

    try {
      loadingSpinner.show();

      await this.initializeNotes();
      this.setupEventListeners();
      this.render();
    } catch (error) {
      console.error("Failed to initialize notes:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message,
      });
    } finally {
      loadingSpinner.hide();
    }
  }

  async initializeNotes() {
    const loadingSpinner = document.createElement("loading-spinner");

    try {
      loadingSpinner.show();
      const fetchedNotes =
        this.currentView === "notes"
          ? await NotesService.getNotes()
          : await NotesService.getArchivedNotes();

      this.notes = fetchedNotes || [];
      localStorage.setItem("notes", JSON.stringify(this.notes));
    } catch (error) {
      console.error(error);
      const storedNotes = localStorage.getItem("notes");
      this.notes = storedNotes ? JSON.parse(storedNotes) : [];

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message,
      });
    } finally {
      loadingSpinner.hide();
    }
  }

  setupEventListeners() {
    document.addEventListener("tab-changed", async (e) => {
      this.currentView = e.detail.tab === "notes" ? "notes" : "archieve";
      await this.initializeNotes();
      this.render();
    });

    document.addEventListener("note-created", async (e) => {
      await this.addNote(e.detail);
    });

    this.addEventListener("note-click", (e) => {
      const noteId = e.detail.noteId;
      this.showNoteDetails(noteId);
    });

    document.addEventListener("note-updated", async () => {
      await this.initializeNotes();
      this.render();
    });

    this.addEventListener("menu-click", (e) => {
      e.stopPropagation();
      const noteId = e.detail.noteId;
      this.showNoteOptions(noteId);
    });
  }

  showNoteOptions(noteId) {
    const note = this.notes.find((note) => note.id === noteId);
    if (!note) return;

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteNote(noteId);

        Swal.fire({
          title: "Deleted!",
          text: `Your note ${note.title} has been deleted.`,
          icon: "success",
        });
      }
    });
  }

  async showNoteDetails(noteId) {
    const loadingSpinner = document.createElement("loading-spinner");

    try {
      loadingSpinner.show();

      const note = await NotesService.getNoteById(noteId);
      let detailComponent = document.querySelector("note-detail");
      if (!detailComponent) {
        detailComponent = document.createElement("note-detail");
        document.body.appendChild(detailComponent);
      }
      detailComponent.showNote(note.id);
    } catch (error) {
      console.error("Error showing note details:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message,
      });
    } finally {
      loadingSpinner.hide();
    }
  }

  async toggleArchiveNote(noteId) {
    const loadingSpinner = document.createElement("loading-spinner");

    try {
      loadingSpinner.show();

      const noteElement = this.querySelector(`note-item[note-id="${noteId}"]`);

      if (noteElement) {
        animations.toggleArchive(noteElement);
      }

      const note = this.notes.find((note) => note.id === noteId);
      if (!note) return;

      let updatedNote;
      if (note.archived) {
        updatedNote = await NotesService.unarchiveNote(noteId);
      } else {
        updatedNote = await NotesService.archiveNote(noteId);
      }

      if (updatedNote) {
        this.notes = this.notes.filter((n) => n.id !== noteId);
        this.render();
      }
    } catch (error) {
      console.error("Error toggling archive:", error);
    } finally {
      loadingSpinner.hide();
    }
  }

  async deleteNote(noteId) {
    const loadingSpinner = document.createElement("loading-spinner");

    try {
      loadingSpinner.show();

      const noteElement = this.querySelector(`note-item[note-id="${noteId}"]`);

      if (noteElement) {
        await NotesService.deleteNote(noteId);
        await this.initializeNotes();
        this.render();
      } else {
        await NotesService.deleteNote(noteId);
        await this.initializeNotes();
        this.render();
      }
    } catch (error) {
      console.error("Error deleting note:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message,
      });
    } finally {
      loadingSpinner.hide();
    }
  }

  async addNote(noteData) {
    const loadingSpinner = document.createElement("loading-spinner");

    try {
      loadingSpinner.show();

      const newNote = {
        title: noteData.title,
        body: noteData.body,
      };

      await NotesService.saveNote(newNote);

      Swal.fire({
        title: "Success!",
        text: `Your note ${newNote.title} has been added.`,
        icon: "success",
      });

      await this.initializeNotes();
      this.render();
    } catch (error) {
      console.error("Error adding note:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message,
      });
    } finally {
      loadingSpinner.hide();
    }
  }

  // render method remains the same
  render() {
    const filteredNotes = this.notes.filter(
      (note) =>
        (this.currentView === "notes" && !note.archived) ||
        (this.currentView === "archieve" && note.archived),
    );

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
        ${
          filteredNotes.length === 0
            ? `<div class="text-center col-span-full mt-8 text-gray-400">No ${this.currentView} found</div>`
            : ""
        }
      </div>
    `;

    const container = this.querySelector(".notes-grid");

    filteredNotes.forEach((note) => {
      const noteElement = document.createElement("note-item");

      noteElement.setAttribute("note-title", note.title);
      noteElement.setAttribute("note-id", note.id);
      noteElement.setAttribute("note-body", note.body);

      container.appendChild(noteElement);
    });

    this.observeAndAnimateNotes();
  }

  observeAndAnimateNotes() {
    const items = this.querySelectorAll("note-item");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            anime({
              targets: entry.target,
              opacity: [0, 1],
              translateY: [40, 0],
              duration: 600,
              easing: "easeOutExpo",
            });

            observer.unobserve(entry.target); // animasi hanya 1x saat pertama tampil
          }
        });
      },
      {
        threshold: 0.1,
      },
    );

    items.forEach((item) => {
      item.style.opacity = 0;
      observer.observe(item);
    });
  }
}

customElements.define("notes-list", NotesList);
