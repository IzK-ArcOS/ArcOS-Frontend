/**
 * CalculatorApp 1.0.0
 *
 * Authored by Izaak Kuipers, development started January 18th 2023.
 *
 * All code in this file is written by the author and licensed under GPLv3.
 *
 * Original filename: src/ts/applogic/apps/Calculator/main.ts
 */

import { get, writable } from "svelte/store";
import { Log } from "../../../console";
import type { AppKeyCombinations } from "../../keyboard/interface";
import type {
  CalculatorKey,
  CalculatorKeys,
  CalculatorOverrides,
} from "./interface";
import { CalculatorStore as Store } from "./store";
import { LogLevel } from "../../../console/interface";

export const CalculatorValue = writable<string>("");

class CL {
  constructor() {
    this.keys = this.compileKeys(Store.AllowedKeys, Store.Overrides);
  }

  public keys: CalculatorKeys = [];
  public Functions: { [key: string]: [string, () => void, string] } = {
    "%%C": ["C", () => CalculatorValue.set(""), "clear"],
    "%%E": ["=", this.evaluate, "process"],
  };

  // Compile keypad keys by merging allowed keys and their overrides for the Calculator UI
  private compileKeys(
    keys: string[],
    overrides: CalculatorOverrides
  ): CalculatorKeys {
    const value: CalculatorKeys = [];

    for (let i = 0; i < keys.length; i++) {
      let v: CalculatorKey = [null, null];

      v[0] = overrides[keys[i]] || keys[i];
      v[1] = keys[i];

      value.push(v);
    }

    return value;
  }

  // Calculate the calculator value and set it to itself
  public evaluate(): string | false {
    Log(
      `${Store.Source} evaluate`,
      `Evaluating sum ("${get(CalculatorValue)}")`,
      LogLevel.info
    );

    if (!CalculatorClass.isValid(get(CalculatorValue))) return false;

    const value = eval(get(CalculatorValue));

    CalculatorValue.set(value);

    return value;
  }

  // Tests the current value plus the new input to evaluate if it's valid.
  private isValid(input: string) {
    Log(
      `${Store.Source} isValid`,
      `Verifying input "${input}"...`,
      LogLevel.info
    );

    // %% represents keys that have a function other than adding to the value
    if (input.startsWith("%%")) return false;

    for (let i = 0; i < input.length; i++) {
      if (Store.AllowedKeys.includes(input[i])) continue;

      Log(
        `${Store.Source} isValid`,
        `Input "${input}" not valid.`,
        LogLevel.warn
      );

      return false;
    }

    return true;
  }

  // Generate a list of keyboard shortcuts from keys to pass to the Calculator AppData.
  generateKeyboardShortcuts() {
    let shortCuts: AppKeyCombinations = [];

    for (let i = 0; i < Store.Shortcuts.length; i++) {
      shortCuts.push({
        key: Store.Shortcuts[i],
        action: () => this.processKey(Store.Shortcuts[i]),
      });
    }

    return shortCuts;
  }

  // Processes incoming key inputs from either the window
  // or the AppShortcuts (Calculator Events)
  processKey(key: string) {
    Log(`${Store.Source} processKey`, `Processing key "${key}"`, LogLevel.info);

    if (!this.isValid(key)) return false;

    // Note: Added the zero to prevent stuff like "+" at the end,
    // causing it to return invalid.
    const newValue = `${get(CalculatorValue)}${key}0`;

    try {
      /**
       * An eval will error if the given expression is invalid, we can use
       * this to see if the new value is valid.
       *
       * Note: This will return valid things for expressions such as "//////"
       * because that's valid Javascript. This still has to be fixed.
       */
      eval(newValue);
    } catch {
      Log(
        `${Store.Source} Calculator/main.ts: processKey`,
        `Test sum "${newValue}" is not valid. Aborting.`,
        LogLevel.error
      );

      return false; // The eval errored, so the new sum is invalid.
    }

    // The eval didn't error, so the new value is correct.
    CalculatorValue.set(get(CalculatorValue) + key);
  }
}

export const CalculatorClass = new CL();
