import { Element3D, ElementData } from '@/engine/interface';
import { Render } from '@/engine/render';
import { Command } from './interface';
import * as THREE from 'three';

class DragCommand implements Command {
  constructor(private engine: Render, private options: { dragStartPosition: THREE.Vector3, dragingObject: Element3D }) {
    this.options.dragStartPosition = this.options.dragStartPosition.clone();
  }

  execute(): void {
    this.engine.controller.action.drag.onDragEnd();
  }

  undo(): void {
    const x = this.options.dragStartPosition.x;
    const y = this.options.dragStartPosition.y;
    const z = this.options.dragStartPosition.z;
    const oldPosition = new THREE.Vector3(x, y, z);
    this.engine.controller.action.drag.updateDragStartEffect(this.options.dragingObject);
    this.engine.controller.action.drag.updateDragingEffect(oldPosition);
    this.engine.controller.action.drag.onDragEnd();
  }
}

export default DragCommand;