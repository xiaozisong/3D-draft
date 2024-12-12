import { Render } from "@/engine/render";
import { LineAction } from "./line";
export class Action {

  line: LineAction;

  constructor(private engine: Render) {
    this.line = new LineAction(engine);
  };
};