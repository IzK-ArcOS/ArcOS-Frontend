import { writable } from "svelte/store";
import Shell from "../../../lib/Page/Desktop/Shell.svelte";
import { SEP_ITEM } from "../../contextmenu/main";
import { ArcOSVersion } from "../../env/main";
import { openWindow } from "../events";
import type { App } from "../interface";
import { openByKey } from "./SettingsApp/store";
import { Logo } from "../../branding";

export const ArcShell: App = {
  info: {
    name: "ArcShell",
    description: "The ArcOS Shell",
    builtin: true,
    version: ArcOSVersion,
    author: "ArcOS Team",
    icon: Logo(),
    custom: true,
    appGroup: "coreApps",
  },
  size: { w: NaN, h: NaN },
  pos: { x: 0, y: 0 },
  minSize: { w: NaN, h: NaN },
  maxSize: { w: NaN, h: NaN },
  controls: { min: false, max: false, cls: false },
  state: {
    headless: true,
    resizable: false,
    windowState: { min: false, max: false, fll: true },
  },
  content: Shell,
  glass: false,
  events: {},
  contextMenu: {
    "shell-taskbar": [
      {
        caption: "Application Manager",
        action: () => {
          openWindow("AppMan");
        },
      },
      SEP_ITEM,
      {
        icon: "settings",
        caption: "Shell settings",
        action: () => {
          openWindow("SettingsApp");
          setTimeout(() => {
            openByKey("Shell");
          });
        },
      },
    ],
  },
  core: true,
};

export const showShellShade = writable<boolean>(false);
