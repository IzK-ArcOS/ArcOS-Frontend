import TestApp2 from "../../../lib/Apps/TestApp2.svelte";
import { TestAppIcon } from "../../icon/apps";
import type { App } from "../interface";

export const UITester: App = {
  info: {
    name: "User Interface Troubleshooter",
    description: "Test the UI",
    builtin: true,
    version: "1.0.0",
    author: "Izaak Kuipers",
    icon: TestAppIcon,
    hidden: true,
  },
  size: { w: 640, h: 480 },
  pos: { x: 30, y: 40 },
  minSize: { w: 640, h: 300 },
  maxSize: { w: 800, h: 600 },
  controls: { min: true, max: true, cls: true },
  state: {
    headless: false,
    resizable: false,
    windowState: { min: false, max: false, fll: false },
  },
  content: TestApp2,
  glass: true,
};
