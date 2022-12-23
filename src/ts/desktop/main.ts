import { writable } from "svelte/store";
import { AppManagerAppData } from "../applogic/apps/AppManager/Manager";
import { closeWindow, openWindow } from "../applogic/events";
import { makeNotification } from "../notiflogic/main";
import { applyState } from "../state/main";
import { UserData } from "../userlogic/interfaces";

export const startOpened = writable<boolean>(false);
export const loggingOff = writable<boolean>(false);
export const shuttingDown = writable<boolean>(false);
export const restarting = writable<boolean>(false);

export const showDesktop = writable<boolean>(false);
export const desktopClassNames = writable<string>("");

export function assignDesktopListeners() {
  UserData.subscribe((v) => {
    if (v) {
      const udata = v;

      let classes = "";

      if (udata.sh.taskbar.docked) classes += `tbdocked `;
      if (!udata.sh.anim) classes += `noani `;
      if (udata.sh.noGlass) classes += `noglass `;
      if (udata.sh.window.bigtb) classes += `bigtitlebars `;

      desktopClassNames.set(classes);
    }
  });

  AppManagerAppData.subscribe((v) => {
    makeNotification({
      title: "App Manager App Data changed",
      message: `App manager app data changed to: ${v ? v.id : "<none>"}.`,
      icon: "warning",
      buttons: [{ capt: "Close", action() {} }],
      timeout: 3000,
    });

    if (v) openWindow("apppoker");
    else closeWindow("apppoker");
  });

  loggingOff.subscribe((v) => {
    if (v) {
      showDesktop.set(false);

      setTimeout(() => {
        applyState("logoff");

        loggingOff.set(false);
      }, 500);
    }
  });

  restarting.subscribe((v) => {
    if (v) {
      showDesktop.set(false);

      setTimeout(() => {
        applyState("restart");

        restarting.set(false);
      }, 500);
    }
  });

  shuttingDown.subscribe((v) => {
    if (v) {
      showDesktop.set(false);

      setTimeout(() => {
        applyState("shutdown");

        shuttingDown.set(false);
      }, 500);
    }
  });
}
