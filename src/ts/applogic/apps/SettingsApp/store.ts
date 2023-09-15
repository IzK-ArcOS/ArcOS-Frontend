import accountIcon from "../../../../assets/apps/settings/account.svg";
import appsIcon from "../../../../assets/apps/settings/apps.svg";
import desktopIcon from "../../../../assets/apps/settings/desktop.svg";
import visualsIcon from "../../../../assets/apps/settings/personalization.svg";
import shellIcon from "../../../../assets/apps/settings/taskbar.svg";
import windowsIcon from "../../../../assets/apps/settings/windows.svg";
import themesIcon from "../../../../assets/apps/settings/themes.svg";
import About from "../../../../lib/Apps/Settings/Pages/About.svelte";
import Account from "../../../../lib/Apps/Settings/Pages/Account.svelte";
import Apps from "../../../../lib/Apps/Settings/Pages/Apps.svelte";
import Desktop from "../../../../lib/Apps/Settings/Pages/Desktop.svelte";
import Shell from "../../../../lib/Apps/Settings/Pages/Shell.svelte";
import Themes from "../../../../lib/Apps/Settings/Pages/Themes.svelte";
import Visuals from "../../../../lib/Apps/Settings/Pages/Visuals.svelte";
import Windows from "../../../../lib/Apps/Settings/Pages/Windows.svelte";
import { Logo } from "../../../branding";
import { openWindow } from "../../events";
import type { SettingsPage } from "./interface";
import { currentSettingsPage } from "./main";

export const SettingsPages: SettingsPage[] = [
  {
    name: "Account",
    icon: accountIcon,
    content: Account,
    sep: true,
  },
  {
    name: "Themes",
    icon: themesIcon,
    content: Themes,
  },
  {
    name: "Wallpaper",
    icon: desktopIcon,
    content: Desktop,
  },
  {
    name: "Visuals",
    icon: visualsIcon,
    content: Visuals,
    sep: true,
  },
  {
    name: "Shell",
    icon: shellIcon,
    content: Shell,
  },
  {
    name: "Windows",
    icon: windowsIcon,
    content: Windows,
  },
  {
    name: "Apps",
    icon: appsIcon,
    content: Apps,
    sep: true,
  },
  {
    name: "About",
    icon: Logo(),
    content: About,
  },
];

export function getSettingsPage(key: string): SettingsPage {
  for (let i = 0; i < SettingsPages.length; i++) {
    if (SettingsPages[i].name == key) {
      return SettingsPages[i];
    }
  }

  return null;
}

export function openByKey(key: string) {
  const page = getSettingsPage(key);

  if (!page) return;

  openWindow("SettingsApp");

  setTimeout(() => {
    currentSettingsPage.set(page);
  }, 10);
}
