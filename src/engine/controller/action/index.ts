import { Render } from "@/engine/render";
import { LineAction } from "./line";
import { SelectAction } from "./select";
import { TextAction } from "./text";
import { DragAction } from "./drag";
export class Action {

  line: LineAction;

  select: SelectAction;

  text: TextAction;

  drag: DragAction;

  constructor(private engine: Render) {
    this.line = new LineAction(engine);
    this.select = new SelectAction(engine);
    this.text = new TextAction(engine);
    this.drag = new DragAction(engine);
  };
};