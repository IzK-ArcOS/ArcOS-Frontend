import { Log } from "../console";
import { LogLevel } from "../console/interface";
import type { SoundBusStore, SoundStore } from "./interface";
import { ArcSounds } from "./store";

export class SoundBus {
  private store: SoundStore = {};
  private _bus: SoundBusStore = {};

  constructor(store: SoundStore) {
    if (!store) {
      Log(
        "SoundBus",
        `Can't create SoundBus without valid store.`,
        LogLevel.error
      );
      return;
    }

    this.store = store;
  }

  public playSound(id: string) {
    if (!this.store[id] || this._bus[id]) return false;

    Log("SoundBus.playSound", `Playing sound ${id} from store`, LogLevel.info);

    const element = document.createElement("audio");

    element.muted = true;
    element.src = this.store[id];
    element.volume = 1;

    try {
      element.play();

      setTimeout(() => {
        element.muted = false;
      }, 10);
    } catch (e) {
      Log(
        "SoundBus.playSound",
        `Can't play ${id}: User didn't interact with the page first`,
        LogLevel.error
      );

      return false;
    }

    this._bus[id] = element;

    element.onended = () => delete this._bus[id];

    return true;
  }

  public stopSound(id: string) {
    Log("SoundBus.stopSound", `Stopping ${id}`, LogLevel.info);

    if (!this._bus[id]) return false;

    this._bus[id].src = null;
    this._bus[id].currentTime = -1;
    this._bus[id].pause();

    return true;
  }

  public getStore(): [string, string][] {
    return Object.entries(this.store);
  }

  public loadExternal(source: string, play: boolean = false) {
    const uuid = `${Math.floor(Math.random() * 1e9)}`;

    this.store[uuid] = source;

    if (play) this.playSound(uuid);
  }
}

export const ArcSoundBus = new SoundBus(ArcSounds);
