import { appWindow } from "@tauri-apps/api/window";
import { writable } from "svelte/store";
import { logoffToken } from "../api/cred";
import { InvalidStateBugrep } from "../bugrep";
import { Log, LogLevel } from "../console";
import { Var } from "../env/vars";
import type { State } from "./interfaces";
import { States } from "./store";

export const CurrentState = writable<State>(States[0]);

export function applyState(stateKey: string) {
  if (States.has(stateKey)) {
    Log({
      level: LogLevel.info,
      source: "state/main.ts: applyState",
      msg: `Applying state ${stateKey}`,
    });

    const state = States.get(stateKey);

    if (state.onload) state.onload();

    CurrentState.set(state);

    const t = `ArcOS | ${state.name}`;

    document.title = t;
    try {
      appWindow.setTitle(state.name);
    } catch {
      /** */
    }

    if (stateKey != "desktop") logoffToken();

    return;
  }

  InvalidStateBugrep("ArcOS State Switcher", stateKey);
}
