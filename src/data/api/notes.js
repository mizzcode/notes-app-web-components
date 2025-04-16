import { fetchApi } from "../../utils/fetch";

class NotesService {
  static async saveNote(note) {
    try {
      const savedNote = await fetchApi("/notes", "POST", note);
      return savedNote;
    } catch (error) {
      throw error;
    }
  }

  static async getNotes() {
    try {
      const notes = await fetchApi("/notes");
      return notes;
    } catch (error) {
      throw error;
    }
  }

  static async getArchivedNotes() {
    try {
      const archivedNotes = await fetchApi("/notes/archived");
      return archivedNotes;
    } catch (error) {
      throw error;
    }
  }

  static async getNoteById(id) {
    try {
      const note = await fetchApi(`/notes/${id}`);
      return note;
    } catch (error) {
      throw error;
    }
  }

  static async archiveNote(id) {
    try {
      await fetchApi(`/notes/${id}/archive`, "POST");
      const note = await this.getNoteById(id);
      return note;
    } catch (error) {
      throw error;
    }
  }

  static async unarchiveNote(id) {
    try {
      await fetchApi(`/notes/${id}/unarchive`, "POST");
      const note = await this.getNoteById(id);
      return note;
    } catch (error) {
      throw error;
    }
  }

  static async deleteNote(id) {
    try {
      const deletedNote = await fetchApi(`/notes/${id}`, "DELETE");
      return deletedNote;
    } catch (error) {
      throw error;
    }
  }

  static handleError(message, error) {
    console.error(message, error);
    throw error;
  }
}

export default NotesService;
