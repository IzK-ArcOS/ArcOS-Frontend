import FileBrowser from "../../../lib/Apps/FileBrowser.svelte";
import { FileManagerIcon } from "../../icon/apps";
import type { App } from "../interface";
import { FileManagerContextMenu } from "./FileBrowser/context";
import { fbState, fbClass } from "./FileBrowser/main";
import { fbOverlays } from "./FileBrowser/overlays";

export const FileBrowserApp: App = {
  info: {
    name: "File Manager",
    description: "Browse your files",
    builtin: true,
    version: "2.5.1",
    author: "ArcOS Team",
    icon: FileManagerIcon,
    appGroup: "utilities",
  },
  size: { w: 700, h: 450 },
  pos: { x: 30, y: 40 },
  minSize: { w: 700, h: 450 },
  maxSize: { w: 1000, h: 600 },
  controls: { min: true, max: true, cls: true },
  state: {
    headless: false,
    resizable: true,
    windowState: { min: false, max: false, fll: false },
  },
  content: FileBrowser,
  glass: true,
  overlays: fbOverlays,
  contextMenu: FileManagerContextMenu,
  events: {
    async open() {
      fbState.update((v) => {
        v.home = true;
        return v;
      });
      /* await fbClass.goToDirectory("./", false); */
    },
  },
};
