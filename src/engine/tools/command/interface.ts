export interface Command {
  execute(): unknown;
  undo(): void;
}