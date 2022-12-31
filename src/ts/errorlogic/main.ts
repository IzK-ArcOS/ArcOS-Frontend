import { get } from "svelte/store";
import icon from "../../assets/apps/errordialog.svg";
import type { App } from "../applogic/interface";
import { maxZIndex } from "../applogic/store";
import { Log, LogLevel } from "../console";
import { ArcOSVersion } from "../env/main";
import {
  ErrorButton,
  ErrorMessage,
  ErrorMessages,
  ErrorWindowStore,
} from "./app";

export function getErrorElement(id: string): HTMLDivElement {
  Log({
    msg: `Getting error element of ${id}`,
    source: "errorlogic/main.ts: getErrorElement",
    level: LogLevel.info,
  });

  const el = document.querySelector(`window#${id}`);

  return el as HTMLDivElement;
}

export function errorMessage(
  title: string,
  message: string,
  image?: string,
  ...buttons: ErrorButton[]
) {
  Log({
    msg: `Generating "${title}"`,
    source: "errorlogic/main.ts: errorMessage",
    level: LogLevel.info,
  });

  const error: ErrorMessage = {
    title,
    message,
    opened: false,
    buttons,
    id: Math.floor(Math.random() * 1e10),
    image,
  };

  const em = get(ErrorMessages);

  em.push(error);

  ErrorMessages.set(em);

  createErrorAppData(error);
}

export function closeError(id: number) {
  Log({
    msg: `Closing error ${id}`,
    source: "errorlogic/main.ts: closeError",
    level: LogLevel.info,
  });

  const ews = get(ErrorWindowStore);

  for (let i = 0; i < ews.length; i++) {
    if (ews[i].id == `error_${id}`) ews[i].opened = false;
  }

  ErrorWindowStore.set(ews);
}

export function openError(id: number) {
  Log({
    msg: `Opening error ${id}`,
    source: "errorlogic/main.ts: openError",
    level: LogLevel.info,
  });

  const ews = get(ErrorWindowStore);

  for (let i = 0; i < ews.length; i++) {
    if (ews[i].id == `error_${id}`) ews[i].opened = true;
  }

  ErrorWindowStore.set(ews);
}

export function createErrorAppData(data: ErrorMessage) {
  Log({
    msg: `Generating error appData for ${data.title}`,
    source: "errorlogic/main.ts: createErrorAppData",
    level: LogLevel.info,
  });

  const error: App = {
    info: {
      name: data.title,
      description: "ArcOS.Desktop.ErrorLogicwindow",
      builtin: true,
      version: ArcOSVersion,
      author: "Generated by ArcOS",
      icon: data.image || icon,
    },
    size: { w: NaN, h: NaN },
    pos: { x: 30, y: 40 },
    minSize: { w: 200, h: NaN },
    maxSize: { w: 600, h: NaN },
    controls: { min: false, max: false, cls: true },
    state: {
      headless: false,
      resizable: false,
      windowState: { min: false, max: false, fll: false },
    },
    content: null,
    glass: false,
    id: `error_${data.id}`,
    opened: false,
  };

  const ews = get(ErrorWindowStore);

  ews.push(error);

  ErrorWindowStore.set(ews);

  setTimeout(() => {
    openError(data.id);

    const el = document.querySelector(`window#${error.id}`) as HTMLDivElement;

    if (!el)
      return Log({
        level: LogLevel.error,
        msg: `Can't bring window ${error.id} to front, no associated element could be found.`,
        source: "ErrorLogic: createErrorAppData",
      });

    maxZIndex.set(get(maxZIndex) + 1);

    el.style.zIndex = `${get(maxZIndex)}`;
  }, 5);
}
