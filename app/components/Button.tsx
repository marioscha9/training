// components/Button.tsx
import { Control } from "ol/control";

interface ButtonOptions {
  target: string | HTMLElement | undefined;
  html?: string;
  className?: string;
  title?: string;
  handleClick?: () => void;
}

class Button extends Control {
  constructor(options: ButtonOptions) {
    const button = document.createElement("button");
    button.innerHTML = options.html || "";
    button.className = options.className || "ol-button";
    button.title = options.title || "";

    button.addEventListener("click", options.handleClick || (() => {}), false);

    const element = document.createElement("div");
    element.className = "ol-unselectable ol-control";
    element.appendChild(button);

    super({
      element: element,
      target: options.target,
    });
  }
}

export default Button;
