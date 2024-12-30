import { ElementData } from '@/engine/interface';
import { Render } from '@/engine/render';
import { Command } from './interface';

class AddElementCommand implements Command {
  addedElementKey?: string;

  constructor (private engine: Render, private data: ElementData) {

  }

  execute(): void {
    const element = this.engine.controller.element.addElement(this.data);
    this.addedElementKey = element.key;
    return element;
  }

  undo(): void {
    if (this.addedElementKey) {
      this.engine.controller.element.deleteElementByKey(this.addedElementKey);
    }
  }
}

export default AddElementCommand;