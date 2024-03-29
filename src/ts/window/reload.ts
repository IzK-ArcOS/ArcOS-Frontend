import { get } from "svelte/store";
import { openByKey } from "../applogic/apps/SettingsApp/store";
import { WindowStore } from "../applogic/store";
import { makeNotification } from "../notiflogic/main";
import { importDefault } from "../applogic/imports/main";

export function reloadApps() {
  const ws = get(WindowStore);

  for (let i = 0; i < ws.length; i++) {
    if (!ws[i].info.builtin) continue;

    ws.splice(i, 1);
  }

  WindowStore.set(ws);

  setTimeout(() => {
    importDefault();

    makeNotification({
      title: "Reloaded",
      message: `All applications have been reloaded. Any unsaved information across all apps has been lost.`,
      icon: "autorenew",
      buttons: [
        {
          caption: "Open Apps Settings",
          action: () => {
            openByKey("Apps");
          },
        },
      ],
    });
  }, 100);
}
