import { writable } from "svelte/store";
import logo from "../../../assets/apps/exit.svg";
import ExitSvelte from "../../../lib/Apps/Exit.svelte";
import type { App } from "../interface";

export const Exit: App = {
  info: {
    name: "Exit",
    description: "ArcOS Exit Menu",
    builtin: true,
    version: "2.0.0",
    author: "Izaak Kuipers",
    icon: logo,
    hidden: true,
  },
  size: { w: 280, h: 50 },
  pos: { x: 0, y: 0 },
  minSize: { w: 280, h: 50 },
  maxSize: { w: 280, h: 50 },
  controls: { min: false, max: false, cls: true },
  state: {
    headless: true,
    resizable: false,
    windowState: { min: false, max: false, fll: true },
  },
  content: ExitSvelte,
  glass: true,

  events: {
    keyboardShortcuts: [
      {
        shift: true,
        key: "",
        action() {
          ExitShowAT.set(true);
        },
      },
    ],
    close(app) {
      ExitShowAT.set(false);
    },
  },
};

export const ExitShowAT = writable<boolean>(false);
