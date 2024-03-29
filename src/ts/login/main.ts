import { get, writable } from "svelte/store";
import { ConnectedServer } from "../api/main";
import { InvalidStateBugrep } from "../bugrep";
import { Log } from "../console";
import { LogLevel } from "../console/interface";
import type { State } from "../state/interfaces";
import { applyState } from "../state/main";
import { getUsers } from "../userlogic/main";
import { LoginStates } from "./store";

export const CurrentLoginState = writable<State>();
export const loginUsername = writable<string>();

export function applyLoginState(stateKey: string) {
  if (LoginStates.has(stateKey)) {
    Log(
      "login/main.ts: applyLoginState",
      `Applying state ${stateKey}`,
      LogLevel.info
    );

    const state = LoginStates.get(stateKey);

    CurrentLoginState.set(state);

    return;
  }

  InvalidStateBugrep("Login", stateKey);
}

export async function loginOnMount() {
  const users = await getUsers();
  const remembered = localStorage.getItem("arcos-remembered-token");
  const state = get(CurrentLoginState);
  const server = get(ConnectedServer);

  setTimeout(() => {
    if (!state) applyLoginState("todesktop");

    if (!Object.keys(users).length && !remembered) {
      if (!server) {
        applyState("fts");
      } else {
        applyLoginState("newapiuser");
      }

      return;
    }
  }, 100);
}
