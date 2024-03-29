import { get, writable } from "svelte/store";
import type { App } from "../../interface";
import { AppRuntime } from "../../runtime/main";

export class QlorbRuntime extends AppRuntime {
  public readonly random = (m: number) => Math.floor(Math.random() * m);
  public readonly Boxes = writable<Box[]>([]);
  public readonly BoxesOffset = writable<number>(0);
  public readonly Clicks = writable<number>(0);
  public readonly Score = writable<number>(0);
  public readonly OldScore = writable<number>(0);
  public readonly OldClicks = writable<number>(0);
  public readonly BOX_SIZE = 30;
  public readonly BOX_VALUES = [1, -1, -1, 5, 2, -5, -4, 1, -2];
  public readonly PAGES = ["intro", "start", "help", "game"];

  constructor(app: App) {
    super(app);

    setInterval(() => {
      if (
        get(this.Boxes).length - get(this.Clicks) < 21 &&
        get(this.CurrentPage) == "game"
      )
        this.spawnBox();
    }, 300);
  }

  public spawnBox(
    props?: Nullable<Box>,
    useOffset?: boolean,
    forcePositive = false
  ): Box {
    this.Log(
      `Spawning box (useOffset = ${useOffset}, forcePositive = ${forcePositive})`,
      "spawnBox"
    );

    const boxProps: Box =
      props || this.createRandomBox(useOffset, forcePositive);

    this.Boxes.update((v) => {
      v.push(boxProps);

      return v;
    });

    this.BoxesOffset.update((v) => v + 1);

    return boxProps;
  }

  private createRandomBox(useOffset = true, forcePositive = false): Box {
    this.Log(
      `Creating random box (useOffset = ${useOffset}, forcePositive = ${forcePositive})`,
      "createRandomBox"
    );
    const values = !forcePositive
      ? this.BOX_VALUES
      : this.BOX_VALUES.filter((v) => v > 0);
    const modifier = values[this.random(values.length)];
    const offset = this.random(this.BOX_SIZE * 2);

    const box: Box = {
      modifier,
      class: this.findBoxClass(modifier),
      yoffset: useOffset ? offset : 0,
    };

    return box;
  }

  private findBoxClass(mod: number): string {
    if (mod > 3) return "golden";
    if (mod < 0) return "bad";
    if (mod == 1) return "good";
    if (mod == 0) return "neutral";

    return "good";
  }

  public ScorePoints(box: Box, button?: HTMLButtonElement): void {
    this.Log(`Scoring ${box.modifier} points`, "ScorePoints");
    if (box.modifier < 0) return this.clickReset();

    this.Score.update((v) => v + box.modifier);
    this.Clicks.update((v) => v + 1);

    this.spawnBox();

    if (button) button.blur();
  }

  public ScoreNegativePoints(box: Box, button?: HTMLButtonElement): void {
    this.ScorePoints({ ...box, modifier: -box.modifier }, button);
  }

  private levelDown(): void {
    this.Log(`Deprecating the player's level down...`, "levelDown");

    const score = get(this.Score);

    if (score < 100) return this.Score.set(0);

    return this.Score.set(score - 100);
  }

  public clickReset(): void {
    this.Log(`Resetting click variables`, "clickReset");

    this.saveOldScore();
    this.Clicks.set(1); // Set it to 1 first to force the subscribers to update
    this.Clicks.set(0);
    this.levelDown();
  }

  private saveOldScore(): void {
    this.Log(`Saving old score`, "saveOldScore");

    this.OldScore.set(get(this.Score));
    this.OldClicks.set(get(this.Clicks));
  }

  public flushStores(): void {
    this.Log(`Flushing all stores to their default values`, "flushStores");

    this.Score.set(0);
    this.OldScore.set(0);
    this.Clicks.set(0);
    this.OldClicks.set(0);
    this.Boxes.set([]);
    this.BoxesOffset.set(0);
  }

  public onSwitchPage() {
    this.flushStores();
  }
}
