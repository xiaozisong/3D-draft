import * as THREE from "three";
import tinycolor from "tinycolor2";

export class Color {
  /**
   * 使颜色变暗
   * 
   * @static
   * @param {string} color
   * @param {number} amt
   * @returns
   * 
   * @memberOf Color
   */
  static darkenColor(color: string, amt: number) {
    return tinycolor(color).darken(amt).toString();
  }

  /**
   * 使颜色变色
   * 
   * @static
   * @param {string} color
   * @param {number} amt
   * @returns
   * 
   * @memberOf Color
   */
  static lightenColor(color: string, amt: number) {
    return tinycolor(color).lighten(amt).toString();
  }
}