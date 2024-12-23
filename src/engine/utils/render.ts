import { tinycolor } from 'tinycolor2';
import * as THREE from "three";

export class Render {
  /**
   * 在下几帧调用回调
   * 
   * @static 
   * @param {() => void} callback
   * @param {number} frames
   * 
   * @memberOf Render
   */
  static executeAfterFrames(callback: () => void, frames: number) {
    function frameStep(currentFrame: number) {
      if (currentFrame >= frames) {
        callback();
      } else {
        requestAnimationFrame(() => frameStep(currentFrame + 1));
      }
    }
    frameStep(0);
  }
}