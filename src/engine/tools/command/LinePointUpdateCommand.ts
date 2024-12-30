import { ElementData } from '@/engine/interface';
import { Render } from '@/engine/render';
import { Command } from './interface';
import { Line } from '@/engine/controller/element/line';

class LinePointUpdateCommand implements Command {

  oldPoints?: number[];

  constructor(private engine: Render, private target: Line, private points: number[]) {

  }

  execute(): void {
    this.oldPoints = this.target.getPoints()
    this.target.updatePoints(this.points);
  }

  undo(): void {
    if (this.oldPoints) {
      this.target.updatePoints(this.oldPoints);
    }
  }

}

export default LinePointUpdateCommand;