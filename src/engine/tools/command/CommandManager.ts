import { Command } from "./interface";
import AddElementCommand from "./AddElementCommand";
import DeleteElementCommand from "./DeleteElementCommand";
import LinePointUpdateCommand from "./LinePointUpdateCommand";
import CreateLineCommand from "./CreateLineCommand";
import DragCommand from "./DragCommand";

class CommandManager {
  // 新增元素命令
  static AddElementCommand = AddElementCommand;

  // 删除元素命令
  static DeleteElementCommand = DeleteElementCommand;

  // 添加线段命令
  static LinePointUpdateCommand = LinePointUpdateCommand;

  // 拖拽命令
  static DragCommand = DragCommand;

  // 创建
  static CreateLineCommand = CreateLineCommand;

  private undoStack: Command[] = [];
  private redoStack: Command[] = [];

  executeCommand(command: Command) {
    const result = command.execute();
    this.undoStack.push(command);
    this.redoStack = []; // 执行新命令时清空重做栈
    return result;
  }

  undo(): void {
    const command = this.undoStack.pop();
    if (command) {
      command.undo();
      this.redoStack.push(command);
    }
  }

  redo(): void {
    const command = this.redoStack.pop();
    if (command) {
      command.execute();
      this.undoStack.push(command);
    }
  }

  clear(): void {
    this.undoStack = [];
    this.redoStack = [];
  }
}

export default CommandManager;