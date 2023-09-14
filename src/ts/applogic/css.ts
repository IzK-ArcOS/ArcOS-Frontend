import type { App, OverlayableApp } from "./interface";

export function generateCSS(app: App) {
  let cssString = "";

  cssString += `min-width: ${app.minSize.w}px;`;
  cssString += `min-height: ${app.minSize.h}px;`;
  cssString += `max-width: ${app.maxSize.w}px;`;
  cssString += `max-height: ${app.maxSize.h}px;`;
  cssString += `width: ${app.size.w}px;`;
  cssString += `height: ${app.size.h}px;`;

  return cssString;
}

export function generateOverlayCSS(app: OverlayableApp) {
  let cssString = "";

  cssString += `min-width: ${app.size.w}px;`;
  cssString += `min-height: ${app.size.h}px;`;
  cssString += `max-width: ${app.size.w}px;`;
  cssString += `max-height: ${app.size.h}px;`;
  cssString += `width: ${app.size.w}px;`;
  cssString += `height: ${app.size.h}px;`;

  return cssString;
}
