// src/components/loading-spinner.js
import { Spinner } from "spin.js";
import "spin.js/spin.css";

class LoadingSpinner extends HTMLElement {
  constructor() {
    super();
    this.spinner = null;
  }

  connectedCallback() {
    this.style.position = "fixed";
    this.style.top = "0";
    this.style.left = "0";
    this.style.width = "100%";
    this.style.height = "100%";
    this.style.display = "flex";
    this.style.justifyContent = "center";
    this.style.alignItems = "center";
    this.style.backgroundColor = "rgba(0,0,0,0.5)";
    this.style.zIndex = "9999";
  }

  show() {
    if (this.spinner) {
      this.spinner.stop();
    }

    const opts = {
      lines: 10,
      length: 20,
      width: 10,
      radius: 30,
      scale: 1,
      corners: 1,
      speed: 1,
      rotate: 0,
      animation: "spinner-line-fade-quick",
      direction: 1,
      color: "#ffffff",
      fadeColor: "transparent",
      top: "50%",
      left: "50%",
      shadow: "0 0 1px transparent",
      zIndex: 2000,
      className: "spinner",
    };

    this.spinner = new Spinner(opts).spin(this);

    if (!this.parentNode) {
      document.body.appendChild(this);
    }
  }

  hide() {
    if (this.spinner) {
      this.spinner.stop();
      this.remove();
      this.spinner = null;
    }
  }
}

customElements.define("loading-spinner", LoadingSpinner);
