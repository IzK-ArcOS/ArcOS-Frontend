import { get, writable } from "svelte/store";
import { loginUsingCreds } from "../api/getter";
import { ConnectedServer } from "../api/main";
import { InvalidStateBugrep } from "../bugrep";
import { Log } from "../console";
import type { State } from "../state/interfaces";
import { applyState } from "../state/main";
import { UserData, UserName } from "../userlogic/interfaces";
import { getUsers } from "../userlogic/main";
import { LoginStates } from "./store";
import { LogLevel } from "../console/interface";

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
    if (!state) applyLoginState(remembered ? "autologin" : "todesktop");

    if (!Object.keys(users).length && !remembered) {
      if (!server) {
        applyState("fts");
      } else {
        applyLoginState("newapiuser");
      }

      return;
    }
  }, 100);

  if (
    remembered &&
    (state ? state.key != "shutdown" && state.key != "restart" : true)
  ) {
    const userdata = await loginUsingCreds(remembered);
    const username = atob(remembered).split(":")[0];

    if (!userdata) {
      applyLoginState("todesktop");

      localStorage.removeItem("arcos-remembered-token");

      return;
    }

    loginUsername.set(username);

    UserData.set(userdata);
    UserName.set(username);

    setTimeout(() => {
      applyState("desktop");
    }, 2000);
  }
}
