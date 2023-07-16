import { Log } from "../../console";
import { LogLevel } from "../../console/interface";
import type { App } from "../interface";
import type { AppKeyCombinations } from "./interface";

export const appShortcuts: [string, AppKeyCombinations][] = [];

export function registerAppShortcuts(id: string, app: App) {
  Log(
    "keyboard: registerAppShortcuts",
    `Registering app shortcuts for ${id}`,
    LogLevel.info
  );
  if (!app.events || !app.events.keyboardShortcuts) return false;

  if (isRegistered(id)) return false;

  appShortcuts.push([id, app.events.keyboardShortcuts]);
}

export function registerShortcuts(data: AppKeyCombinations, id?: string) {
  appShortcuts.push([id || "", data]);
}

export function isRegistered(id: string): boolean {
  for (let i = 0; i < appShortcuts.length; i++) {
    if (appShortcuts[i][0] == id) return true;
  }

  return false;
}
