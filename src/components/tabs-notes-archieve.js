class TabsNotesArchieve extends HTMLElement {
  constructor() {
    super();
    this.activeTab = "notes";
  }

  connectedCallback() {
    const templateContent = document
      .querySelector("template#tabs")
      .content.cloneNode(true);
    this.appendChild(templateContent);

    setTimeout(() => {
      const notesTab = this.querySelector("#tab-notes");
      const archieveTab = this.querySelector("#tab-archieve");

      if (notesTab && archieveTab) {
        notesTab.addEventListener("click", () => this.activateTab("notes"));
        archieveTab.addEventListener("click", () =>
          this.activateTab("archieve"),
        );

        this.activateTab(this.activeTab);
      }
    }, 0);
  }

  activateTab(tabName) {
    const notesTab = this.querySelector("#tab-notes");
    const archieveTab = this.querySelector("#tab-archieve");

    if (!notesTab || !archieveTab) return;

    this.activeTab = tabName;

    if (tabName === "notes") {
      notesTab.classList.add("border-white", "bg-transparent", "active");
      notesTab.classList.remove("border-[#35383c]", "bg-[#202224]");

      archieveTab.classList.remove("border-white", "bg-transparent", "active");
      archieveTab.classList.add("border-[#35383c]", "bg-[#202224]");
    } else {
      archieveTab.classList.add("border-white", "bg-transparent", "active");
      archieveTab.classList.remove("border-[#35383c]", "bg-[#202224]");

      notesTab.classList.remove("border-white", "bg-transparent", "active");
      notesTab.classList.add("border-[#35383c]", "bg-[#202224]");
    }

    const event = new CustomEvent("tab-changed", {
      detail: { tab: tabName },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }
}

customElements.define("tabs-notes-archieve", TabsNotesArchieve);
