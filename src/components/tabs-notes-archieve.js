class TabsNotesArchieve extends HTMLElement {
  constructor() {
    super();
    this.activeTab = 'notes'; // Default active tab
  }

  connectedCallback() {
    const templateContent = document.querySelector('template#tabs').content.cloneNode(true);
    this.appendChild(templateContent);

    // Add event listeners to tab buttons after they're in the DOM
    setTimeout(() => {
      const notesTab = this.querySelector('#tab-notes');
      const archieveTab = this.querySelector('#tab-archieve');

      if (notesTab && archieveTab) {
        notesTab.addEventListener('click', () => this.activateTab('notes'));
        archieveTab.addEventListener('click', () => this.activateTab('archieve'));

        // Initialize with the default active tab
        this.activateTab(this.activeTab);
      }
    }, 0);
  }

  activateTab(tabName) {
    const notesTab = this.querySelector('#tab-notes');
    const archieveTab = this.querySelector('#tab-archieve');

    if (!notesTab || !archieveTab) return;

    // Save the active tab
    this.activeTab = tabName;

    // Update tab styling
    if (tabName === 'notes') {
      // Activate Notes tab
      notesTab.classList.add('border-white', 'bg-transparent', 'active');
      notesTab.classList.remove('border-[#35383c]', 'bg-[#202224]');

      // Deactivate Archieve tab
      archieveTab.classList.remove('border-white', 'bg-transparent', 'active');
      archieveTab.classList.add('border-[#35383c]', 'bg-[#202224]');
    } else {
      // Activate Archieve tab
      archieveTab.classList.add('border-white', 'bg-transparent', 'active');
      archieveTab.classList.remove('border-[#35383c]', 'bg-[#202224]');

      // Deactivate Notes tab
      notesTab.classList.remove('border-white', 'bg-transparent', 'active');
      notesTab.classList.add('border-[#35383c]', 'bg-[#202224]');
    }

    // Dispatch custom event for tab change
    const event = new CustomEvent('tab-changed', {
      detail: { tab: tabName },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);
  }
}

customElements.define('tabs-notes-archieve', TabsNotesArchieve);