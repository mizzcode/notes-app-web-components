class HeaderNav extends HTMLElement {
  connectedCallback() {
    // Get template content
    const template = document.querySelector('template#header');

    const templateContent = template.content.cloneNode(true);
    this.appendChild(templateContent);
  }
}

customElements.define('header-nav', HeaderNav);