import { Render } from "@/engine/render";
import { LineAction } from "./line";
import { SelectAction } from "./select";
export class Action {

  line: LineAction;

  select: SelectAction;

  constructor(private engine: Render) {
    this.line = new LineAction(engine);
    this.select = new SelectAction(engine);
  };
};