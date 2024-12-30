import { ElementData } from '@/engine/interface';
import { Render } from '@/engine/render';
import { Command } from './interface';

class CreateLineCommand implements Command {
  addedElementKey?: string;

  constructor(private engine: Render, private showArrow: boolean) {

  }

  execute(): void {
    this.engine.controller.action.line.startCreateLine(this.showArrow);
  }

  undo(): void {
    this.engine.controller.action.line.reset();
  }
}

export default CreateLineCommand;