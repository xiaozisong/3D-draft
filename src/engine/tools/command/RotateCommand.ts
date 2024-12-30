import BaseCommand from './BaseCommand';
import * as THREE from "three";

class RotateCommand extends BaseCommand<THREE.Euler> {
  getCurrentValue(): THREE.Euler {
    return this.object.rotation.clone();
  }

  applyValue(value: THREE.Euler): void {
    this.object.rotation.copy(value);
  }
}

export default RotateCommand;