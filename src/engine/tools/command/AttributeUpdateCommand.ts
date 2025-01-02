import { Element3D, ElementData, OptionsType } from '@/engine/interface';
import { Render } from '@/engine/render';
import { Command } from './interface';
import { get, set } from 'lodash';

class AttributeUpdateCommand implements Command {
  
  oldFieldData?: { value: any, type: string }

  constructor(private engine: Render, private options: { element: Element3D, fieldData: { value: any, type: string } }) {

  }

  execute(): void {
    const newFieldData = this.options.fieldData;
    const { type } = newFieldData;

    const data = this.options.element.getOptions();

    this.oldFieldData = { type, value: get(data, type) };
    this.options.element.updateAttribute(newFieldData);
  }

  undo(): void {
    if (this.oldFieldData) {
      this.options.element.updateAttribute(this.oldFieldData);
      this.engine.controller.element.refreshElementList();
      this.engine.controller.element.refreshProtoPanel();
    }
  }

}

export default AttributeUpdateCommand;