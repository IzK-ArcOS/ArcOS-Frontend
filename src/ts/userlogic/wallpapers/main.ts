import { get } from "svelte/store";
import { readFile } from "../../api/fs/file";
import { Log } from "../../console";
import { LogLevel } from "../../console/interface";
import { UserName } from "../interfaces";
import type { Wallpaper } from "./interface";
import { Wallpapers } from "./store";
import { arrayToBlob } from "../../api/fs/file/conversion";
import { fromBase64 } from "../../base64";

const getters: [string, (id: string) => Wallpaper | Promise<Wallpaper>][] = [
  [
    "@local:",
    async (id) => await wallpaperFromFS(fromBase64(id.replace("@local:", ""))),
  ],
  ["img", (id) => Wallpapers[id] || Wallpapers["img04"]],
];

export async function getWallpaper(
  id: string,
  override?: string
): Promise<Wallpaper> {
  if (!id) return Wallpapers["img04"];

  if (id.startsWith("http")) return { author: "The Web", name: id, url: id };

  for (let i = 0; i < getters.length; i++) {
    if (id.startsWith(getters[i][0])) return await getters[i][1](id);
  }

  return Wallpapers[override || "img04"];
}

export async function wallpaperFromFS(path: string): Promise<Wallpaper> {
  Log(
    "wallpapers.ts: wallpaperFromFS",
    `Reading wallpaper from path "${path}"...`,
    LogLevel.info
  );

  const file = await readFile(path);

  if (!file) {
    Log(
      "wallpapers.ts: wallpaperFromFS",
      `Unable to get wallpaper "${path}"`,
      LogLevel.error
    );

    return Wallpapers["img04"];
  }

  const url = URL.createObjectURL(arrayToBlob(file, "image/jpeg"));

  return { url, author: get(UserName), name: url, source: "" };
}
