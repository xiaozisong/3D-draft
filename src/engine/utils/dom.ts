import * as THREE from "three";
import tinycolor from "tinycolor2";

export class Dom {
  static inputFilters = ["INPUT", "TEXTAREA", "SELECT"];

  static preventInputEvent(event: Event) {
    const target = event.target as HTMLElement;
    if (target.isContentEditable || Dom.inputFilters.includes(target.nodeName)) {
      return true;
    } else {
      return false;
    }
  }
}