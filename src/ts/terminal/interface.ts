import type { ArcTerm } from "./main";

export interface Command {
  keyword: string;
  description: string;
  exec: (cmd: string, argv: string[], term: ArcTerm) => void;
  syntax?: string;
}

export type CommandStore = Command[];

export type Color =
  | "red"
  | "green"
  | "orange"
  | "yellow"
  | "blue"
  | "purple"
  | "aqua"
  | "white"
  | "gray";