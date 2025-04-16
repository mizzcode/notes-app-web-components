class AddButton extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <div class="p-6">
        <button id="add-note-button" class="border border-red-500 p-3 rounded-full w-1/2 flex items-center justify-center mx-auto cursor-pointer hover:bg-red-500/10 transition-colors">
          <img src="./src/images/plus-minus.png" class="w-7 h-7" alt="Add Note" />
        </button>
      </div>
    `;

    const button = this.querySelector("#add-note-button");
    if (button) {
      button.addEventListener("click", () => {
        this.showAddNoteModal();
      });
    }
  }

  showAddNoteModal() {
    let modal = document.querySelector("add-note-modal");

    if (!modal) {
      modal = document.createElement("add-note-modal");
      document.body.appendChild(modal);
    }

    modal.style.display = "block";
  }
}

customElements.define("add-button", AddButton);
