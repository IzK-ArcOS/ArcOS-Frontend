import type { App } from "../applogic/interface";
import { Log } from "../console";
import { LogLevel } from "../console/interface";
import { ArcOSVersion } from "../env/main";
import sleep from "../sleep";
import { ArcTermCommandHandler } from "./commands";
import { ArcTermEnv } from "./env";
import { initError } from "./error";
import { ArcTermInput } from "./input";
import type { CommandStore } from "./interface";
import { ArcTermScripts } from "./scripts";
import { ArcTermSections } from "./sect";
import { ArcTermStd } from "./std";
import { ArcTermUtil } from "./util";
import { ArcTermVariables } from "./var";

/**
 * @WARNING   This part of ArcOS is separated from the Svelte framework in
 *            order to make it easier to write and manage. Frequent checks
 *            are performed through ArcTerm classes in order to keep it clean
 *            and stop it from breaking unexpectedly.
 *
 * - IzKuipers, march 17 2023
 */

export class ArcTerm {
  target: HTMLDivElement;
  commands: CommandStore;
  app: App;
  std: ArcTermStd;
  util: ArcTermUtil;
  env: ArcTermEnv;
  vars: ArcTermVariables;
  input: ArcTermInput;
  path: string;
  scripts: ArcTermScripts;
  sect: ArcTermSections;
  commandHandler: ArcTermCommandHandler;
  referenceId: string;
  onload: (term: ArcTerm) => void;

  constructor(
    t: HTMLDivElement,
    cS: CommandStore,
    a: App,
    cb?: (term: ArcTerm) => void
  ) {
    this.target = t;
    this.commands = cS;
    this.app = a;
    this.onload = cb;

    this.initialize();
  }

  public async initialize() {
    this.util = new ArcTermUtil(this);
    this.referenceId = this.util.getReference();

    Log(
      `ArcTerm ${this.referenceId}`,
      `Initializing new ArcTerm`,
      LogLevel.info
    );

    if (!this.target) return initError(this.app.id);

    this.target.innerText = `Starting ArcTerm v${ArcOSVersion}...`;

    this.target.removeAttribute("style");
    this.path = ".";
    this.commandHandler = new ArcTermCommandHandler(this);
    this.env = new ArcTermEnv(this);
    this.vars = new ArcTermVariables(this);
    this.scripts = new ArcTermScripts(this);
    this.sect = new ArcTermSections(this);

    setTimeout(async () => {
      this.std = new ArcTermStd(this);
      this.input = new ArcTermInput(this);

      this.input.lock();

      if (this.onload) await this.onload(this);

      await sleep(100);

      this.input.unlock();
      this.util.intro();
      this.util.flushAccent();

      if (this.env.gooseBumps) this.std.Warning("GooseBumps 👀\n\n");
    }, 1000);
  }

  public dispose() {
    Log(`ArcTerm ${this.referenceId}`, "Disposing", LogLevel.info);

    if (!this.target) return;

    this.std.clear();
    this.std = null;
    this.env = null;
    this.input.lock();
    this.input = null;
  }

  public reload() {
    Log(`ArcTerm ${this.referenceId}`, "Reloading", LogLevel.info);

    this.dispose(); // Dispose the current instance, locking ArcTerm

    // Re-initialize ArcTerm with the exact same initial parameters
    // after the next frame has advanced
    setTimeout(async () => {
      await this.initialize();
    });
  }
}
