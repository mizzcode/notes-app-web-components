class AddNoteModal extends HTMLElement {
  constructor() {
    super();

    this.style.display = "none";
    this.style.position = "fixed";
    this.style.top = "0";
    this.style.left = "0";
    this.style.width = "100%";
    this.style.height = "100%";
    this.style.zIndex = "1000";
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  render() {
    this.innerHTML = `
      <style>
        .modal-container {
          position: fixed;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
        }
        
        .modal-content {
          background-color: #1f2937;
          padding: 1.5rem;
          border-radius: 0.5rem;
          width: 100%;
          max-width: 28rem;
          margin: 0 1rem;
        }
        
        .modal-title {
          font-size: 1.25rem;
          font-weight: bold;
          margin-bottom: 1.5rem;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        .form-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: 0.5rem;
        }
        
        .form-input {
          width: 100%;
          border-radius: 0.375rem;
          background-color: #374151;
          border: 1px solid #4b5563;
          padding: 0.5rem;
          color: white;
        }
        
        .textarea-input {
          height: 8rem;
        }
        
        .validation-message {
          color: #ef4444;
          font-size: 0.75rem;
          margin-top: 0.25rem;
          height: 1rem;
        }
        
        .checkbox-container {
          display: flex;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        
        .checkbox-input {
          margin-right: 0.5rem;
          cursor: pointer;
        }
        
        .button-container {
          display: flex;
          justify-content: flex-end;
          gap: 0.5rem;
        }
        
        .cancel-button {
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          background-color: #374151;
          color: white;
          cursor: pointer;
        }
        
        .cancel-button:hover {
          background-color: #4b5563;
        }
        
        .save-button {
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          background-color: #ef4444;
          color: white;
          cursor: pointer;
        }
        
        .save-button:hover {
          background-color: #dc2626;
        }
        
        .error-border {
          border-color: #ef4444;
        }
      </style>
      
      <div class="modal-container">
        <div class="modal-content">
          <h2 class="modal-title">Add New Note</h2>
          
          <form id="add-note-form" novalidate>
            <div class="form-group">
              <label for="note-title" class="form-label">Title</label>
              <input 
                type="text" 
                id="note-title" 
                name="title"
                pattern="^[a-zA-Z0-9][a-zA-Z0-9 ._]{0,}[a-zA-Z0-9]$"
                minlength="3"
                autocomplete="off"
                class="form-input"
                placeholder="Note Title"
                required
                aria-describedby="titleValidation"
              >
              <p id="titleValidation" class="validation-message" aria-live="polite"></p>
            </div>
            
            <div class="form-group">
              <label for="note-body" class="form-label">Content</label>
              <textarea 
                id="note-body" 
                name="body"
                minlength="5"
                class="form-input textarea-input"
                placeholder="Write your note here..."
                required
                aria-describedby="bodyValidation"
              ></textarea>
              <p id="bodyValidation" class="validation-message" aria-live="polite"></p>
            </div>
            
            <div class="button-container">
              <button 
                type="button" 
                id="cancel-button"
                class="cancel-button"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                id="save-button"
                class="save-button"
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
    const form = this.querySelector("#add-note-form");
    const titleInput = form.elements.title;
    const bodyInput = form.elements.body;
    const cancelButton = this.querySelector("#cancel-button");

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      if (form.checkValidity()) {
        this.saveNote();
      } else {
        this.validateForm();
      }
    });

    const titleValidationHandler = (event) => {
      event.target.setCustomValidity("");

      if (event.target.validity.valueMissing) {
        event.target.setCustomValidity("Judul wajib diisi.");
        return;
      }

      if (event.target.validity.tooShort) {
        event.target.setCustomValidity(
          `Judul minimal ${event.target.minLength} karakter.`,
        );
        return;
      }

      if (event.target.validity.patternMismatch) {
        event.target.setCustomValidity(
          "Judul tidak boleh diawali atau diakhiri dengan simbol, mengandung spasi, atau mengandung karakter khusus.",
        );
        return;
      }
    };

    const bodyValidationHandler = (event) => {
      event.target.setCustomValidity("");

      if (event.target.validity.valueMissing) {
        event.target.setCustomValidity("Konten wajib diisi.");
        return;
      }

      if (event.target.validity.tooShort) {
        event.target.setCustomValidity(
          `Konten minimal ${event.target.minLength} karakter.`,
        );
        return;
      }
    };

    titleInput.addEventListener("change", titleValidationHandler);
    titleInput.addEventListener("invalid", titleValidationHandler);

    bodyInput.addEventListener("change", bodyValidationHandler);
    bodyInput.addEventListener("invalid", bodyValidationHandler);

    const handleBlur = (event) => {
      const isValid = event.target.validity.valid;
      const errorMessage = event.target.validationMessage;
      const connectedValidationId =
        event.target.getAttribute("aria-describedby");
      const connectedValidationEl = connectedValidationId
        ? document.getElementById(connectedValidationId)
        : null;

      if (connectedValidationEl) {
        if (errorMessage && !isValid) {
          connectedValidationEl.innerText = errorMessage;
          event.target.classList.add("error-border");
        } else {
          connectedValidationEl.innerText = "";
          event.target.classList.remove("error-border");
        }
      }
    };

    titleInput.addEventListener("blur", handleBlur);
    bodyInput.addEventListener("blur", handleBlur);

    if (cancelButton) {
      cancelButton.addEventListener("click", () => {
        this.closeModal();
      });
    }

    // Close when clicking outside the modal
    this.addEventListener("click", (e) => {
      if (e.target === this.querySelector(".modal-container")) {
        this.closeModal();
      }
    });
  }

  validateForm() {
    const form = this.querySelector("#add-note-form");
    const formElements = form.elements;

    for (let i = 0; i < formElements.length; i++) {
      const element = formElements[i];
      if (element.nodeName !== "BUTTON" && element.nodeName !== "FIELDSET") {
        if (!element.validity.valid) {
          element.dispatchEvent(new Event("blur"));
        }
      }
    }
  }

  saveNote() {
    const form = this.querySelector("#add-note-form");
    const formData = new FormData(form);

    const noteData = {
      title: formData.get("title"),
      body: formData.get("body"),
      archived: formData.get("archive") === "on",
    };

    const event = new CustomEvent("note-created", {
      bubbles: true,
      detail: noteData,
    });

    this.dispatchEvent(event);
    this.closeModal();
  }

  closeModal() {
    this.style.display = "none";

    const form = this.querySelector("#add-note-form");
    const validationMessages = this.querySelectorAll(".validation-message");
    const inputs = form.querySelectorAll("input, textarea");

    if (form) form.reset();

    validationMessages.forEach((el) => {
      el.innerText = "";
    });

    inputs.forEach((input) => {
      input.classList.remove("error-border");
    });
  }
}

customElements.define("add-note-modal", AddNoteModal);
