import * as THREE from 'three';
import { Command } from './interface';

abstract class BaseCommand<T> implements Command {
  protected object: THREE.Object3D;
  protected oldValue: T;
  protected newValue: T;

  constructor(object: THREE.Object3D, newValue: T) {
    this.object = object;
    this.oldValue = this.getCurrentValue();
    this.newValue = newValue;
  }

  abstract getCurrentValue(): T;
  abstract applyValue(value: T): void;

  execute(): void {
    this.applyValue(this.newValue);
  }

  undo(): void {
    this.applyValue(this.oldValue);
  }
}

export default BaseCommand;