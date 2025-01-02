import { Element3D, ElementData } from '@/engine/interface';
import { Render } from '@/engine/render';
import { Command } from './interface';
import * as THREE from 'three';

class DragCommand implements Command {
  constructor(private engine: Render, private options: { dragStartPositions: THREE.Vector3[], dragingObjects: Element3D[] }) {
    this.options.dragStartPositions = this.options.dragStartPositions.map(item => new THREE.Vector3(item.x, item.y, item.z));
  }

  execute(): void {
    this.engine.controller.action.drag.onDragEnd();
  }

  undo(): void {
    this.engine.controller.action.drag.updateDragStartEffect(this.options.dragingObjects);
    this.engine.controller.action.drag.updateDragingEffect(this.options.dragStartPositions[0]);
    this.engine.controller.action.drag.onDragEnd();
  }
}

export default DragCommand;