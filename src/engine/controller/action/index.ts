import { Render } from "@/engine/render";
import { LineAction } from "./line";
import { SelectAction } from "./select";
import { TextAction } from "./text";
export class Action {

  line: LineAction;

  select: SelectAction;

  text: TextAction;

  constructor(private engine: Render) {
    this.line = new LineAction(engine);
    this.select = new SelectAction(engine);
    this.text = new TextAction(engine);
  };
};