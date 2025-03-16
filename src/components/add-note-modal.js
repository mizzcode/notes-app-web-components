class AddNoteModal extends HTMLElement {
  constructor() {
    super();

    this.style.display = 'none';
    this.style.position = 'fixed';
    this.style.top = '0';
    this.style.left = '0';
    this.style.width = '100%';
    this.style.height = '100%';
    this.style.zIndex = '1000';
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  render() {
    this.innerHTML = `
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-gray-800 p-6 rounded-lg w-full max-w-md mx-4">
          <h2 class="text-xl font-bold mb-4">Add New Note</h2>
          
          <form id="add-note-form">
            <div class="mb-4">
              <label for="note-title" class="block text-sm font-medium mb-1">Title</label>
              <input 
                type="text" 
                id="note-title" 
                class="w-full rounded bg-gray-700 border border-gray-600 p-2 text-white"
                placeholder="Note Title"
                required
              >
            </div>
            
            <div class="mb-4">
              <label for="note-body" class="block text-sm font-medium mb-1">Content</label>
              <textarea 
                id="note-body" 
                class="w-full rounded bg-gray-700 border border-gray-600 p-2 text-white h-32"
                placeholder="Write your note here..."
                required
              ></textarea>
            </div>
            
            <div class="mb-4">
              <label class="flex items-center">
                <input type="checkbox" id="note-archive" class="mr-2">
                <span>Archive this note</span>
              </label>
            </div>
            
            <div class="flex justify-end space-x-2">
              <button 
                type="button" 
                id="cancel-button"
                class="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                id="save-button"
                class="px-4 py-2 rounded bg-red-500 hover:bg-red-600"
              >
                Save Note
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  setupEventListeners() {
    const form = this.querySelector('#add-note-form');
    const cancelButton = this.querySelector('#cancel-button');

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveNote();
      });
    }

    if (cancelButton) {
      cancelButton.addEventListener('click', () => {
        this.closeModal();
      });
    }

    // Close when clicking outside the modal
    this.addEventListener('click', (e) => {
      if (e.target === this.querySelector('div.fixed')) {
        this.closeModal();
      }
    });
  }

  saveNote() {
    const titleInput = this.querySelector('#note-title');
    const bodyInput = this.querySelector('#note-body');
    const archiveInput = this.querySelector('#note-archive');

    const noteData = {
      title: titleInput.value,
      body: bodyInput.value,
      archived: archiveInput.checked
    };

    // Dispatch event with note data
    const event = new CustomEvent('note-created', {
      bubbles: true,
      detail: noteData
    });

    this.dispatchEvent(event);
    this.closeModal();
  }

  closeModal() {
    this.style.display = 'none';

    // Reset form
    const form = this.querySelector('#add-note-form');
    if (form) form.reset();
  }
}

customElements.define('add-note-modal', AddNoteModal);
