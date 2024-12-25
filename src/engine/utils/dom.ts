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
  
  /**
   * 获取SVG的宽高
   * 
   * @static
   * @param {SVGElement} svgData
   * @returns
   * 
   * @memberOf Dom
   */
  static getSVGWidth(svgData: SVGElement) {
    const viewBox = svgData.getAttribute('viewBox');
    if (!viewBox) {
      return { width: 0, height: 0 };
    }
    const viewBoxValues = viewBox.split(' ');
    const viewBoxWidth = viewBoxValues[2];
    const viewBoxHeight = viewBoxValues[3];
    return { width: parseFloat(viewBoxWidth), height: parseFloat(viewBoxHeight) };
  }
}