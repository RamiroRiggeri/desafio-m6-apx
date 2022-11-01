class ButtonPpt extends HTMLElement {
  shadow: ShadowRoot;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    const style = document.createElement("style");
    style.innerHTML = `
      .btn-ppt{
        font-size: 45px;
        color: white;
        background-color: #006CFC;
        border: 10px solid #001997;
        border-radius: 8px;
        padding: 10px;
        width: 30vw;
        min-width: 300px;
        height: 90px;
        font-family: "Odibee Sans", cursive;
        cursor: pointer;
      }
      `;
    this.shadow.appendChild(style);
  }

  render() {
    const button = document.createElement("button");
    button.className = "btn-ppt";
    button.textContent = this.textContent;
    this.shadow.appendChild(button);
  }
}
customElements.define("button-ppt", ButtonPpt);
