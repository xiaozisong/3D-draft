import { Element3D, ElementData } from '@/engine/interface';
import { Render } from '@/engine/render';
import { Command } from './interface';
import { Point } from '@/engine/controller/element/point';
import { set } from 'lodash';
import { Line } from '@/engine/controller/element/line';

class DeleteElementCommand implements Command {

  // 删除的点对应线的数据
  deletedPointsOnLine: Record<string, number[]> = {};

  // 删除的元素的数据
  deletedElementsData: ElementData[] = [];

  constructor(private engine: Render, private activeElements: Element3D[]) {

  }

  execute(): void {
    this.deletedElementsData = this.activeElements.map(item => item.getData()) as ElementData[];
    for (const element of this.activeElements) {
      // 如果删除的是点，则记录对应线的数据
      if (element instanceof Point) {
        const { lineKey } = element.options;
        if (lineKey) {
          const line = this.engine.controller.element.getElementByKey(lineKey) as Line;
          if (line) {
            set(this.deletedPointsOnLine, lineKey, [...line.getPoints()]);
          }
        }
      }
      this.engine.controller.element.deleteElement(element);
    }
  }

  undo(): void {
    for (const data of this.deletedElementsData) {
      this.engine.controller.element.addElement(data);
    }
    // 如果删除的是点，则回复对应线的数据
    for (const [key, points] of Object.entries(this.deletedPointsOnLine)) {
      const line = this.engine.controller.element.getElementByKey(key) as Line;
      if (line) {
        line.updatePoints(points);
      }
    }
  }
}

export default DeleteElementCommand;