import BaseCommand from './BaseCommand';
import * as THREE from "three";

class MoveCommand extends BaseCommand<THREE.Vector3> {
  getCurrentValue(): THREE.Vector3 {
    return this.object.position.clone();
  }

  applyValue(value: THREE.Vector3): void {
    this.object.position.copy(value);
  }
}

export default MoveCommand;